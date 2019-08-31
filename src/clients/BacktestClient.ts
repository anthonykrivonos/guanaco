import { BacktestSummary, BacktestSymbolSummary } from '../backtest'
import {
	BacktestClientPortfolio,
	HistoricalTrade,
	OrderId,
	OrderResponse,
	OrderSide,
	OrderStatus,
	OrderType,
	Symbol,
	SymbolInfo,
} from '../models'
import { Condition, Converter, Logger } from '../utils'

/**
 * Client for fake transactions in backtesting.
 */
export class BacktestClient {
	/**
	 * Portfolio object containing amounts of each product.
	 */
	private portfolio!: BacktestClientPortfolio

	/**
	 * List of orders made by the backtest client.
	 */
	private orders!: Map<OrderId, HistoricalTrade>

	private orderQueue!: OrderId[]

	/**
	 * Summary containing the simulated date and mappings of symbols to tickers.
	 */
	private summary!: BacktestSummary

	/**
	 * Logs backtesting progress.
	 */
	private logger!: Logger

	constructor(
		portfolio: BacktestClientPortfolio,
		summary: BacktestSummary,
		orders?: Map<OrderId, HistoricalTrade>,
		verbose?: boolean,
	) {
		// Ensure at least one price value is provided for all products
		if (!Condition.hasNotNull(Object.values(portfolio))) {
			throw new Error('Cannot backtest without starting prices')
		}
		this.portfolio = portfolio
		this.summary = summary
		this.orders = orders || new Map()
		this.orderQueue = []
		this.logger = Logger.getInstance(verbose)
	}

	// TODO: Extract bid, ask, and last for historical info.
	public info(symbol: Symbol): SymbolInfo {
		const summaryForSymbol: BacktestSymbolSummary = this.summary[symbol.toString()]
		return {
			ticker: {
				bid: summaryForSymbol.typicalPrice,
				ask: summaryForSymbol.typicalPrice,
				last: summaryForSymbol.typicalPrice,
				volume: summaryForSymbol.volume,
			},
		}
	}

	public async buy(symbol: Symbol, amount: number, price: number, type: OrderType): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.BUY, symbol, amount, price, type)
	}

	public async sell(symbol: Symbol, amount: number, price: number, type: OrderType): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.SELL, symbol, amount, price, type)
	}

	public async cancel(orderId: OrderId): Promise<OrderResponse> {
		if (this.orders.has(orderId)) {
			const order = this.orders.get(orderId)!
			if (!order.executed) {
				order.executed = true
				this.orders.set(order.id, order)
				for (let i = 0; i < this.orderQueue.length; i++) {
					if (this.orderQueue[i] === order.id) {
						this.orderQueue.splice(i, 1)
						break
					}
				}
				const message = `Successfully cancelled backtest order with id ${orderId}`
				this.logger.success(message)
				return {
					message,
					status: OrderStatus.SUCCESS,
				}
			}
		}
		return {
			message: `Could not cancel order with id ${orderId}`,
			status: OrderStatus.CLIENT_FAILURE,
		}
	}

	public async cancelAll(): Promise<OrderResponse> {
		this.orderQueue.forEach((orderId: OrderId) => {
			const order = this.orders.get(orderId)!
			order.executed = true
			this.orders.set(order.id, order)
		})
		this.orderQueue = []
		const message = 'Successfully cancelled all backtest orders'
		this.logger.success(message)
		return {
			message,
			status: OrderStatus.SUCCESS,
		}
	}

	public getHistory(): HistoricalTrade[] {
		return Object.values(this.orders).sort(
			(a: HistoricalTrade, b: HistoricalTrade) => parseInt(a.id.toString()) - parseInt(b.id.toString()),
		)
	}

	public getPortfolio(): BacktestClientPortfolio {
		return this.portfolio
	}

	public getOrders(): Map<OrderId, HistoricalTrade> {
		return this.orders
	}

	/**
	 * Execute in-progress orders, if possible.
	 * @param count The number of orders to execute.
	 */
	public executeOrders(count?: number) {
		const ordersToExecute =
			Condition.notNull(count) && count! <= this.orderQueue.length ? count! : this.orderQueue.length
		this.logger.info(`Executing ${ordersToExecute} order(s)`)
		for (let i = 0; i < ordersToExecute; i++) {
			const nextOrderId: OrderId = this.orderQueue[0]
			this.executeOrder(nextOrderId)
		}
	}

	/**
	 * Executes an order from the order queue given an ID.
	 * @param orderId The ID for the order to execute.
	 */
	private executeOrder(orderId: OrderId) {
		this.logger.info(`Executing order with ID ${orderId}`)

		const order: HistoricalTrade = this.orders.get(orderId)!
		const symbolSummary: BacktestSymbolSummary = this.summary[order.symbol!.toString()]
		const product = Converter.symbolToProducts(order.symbol!)![1].toLowerCase()
		const actualPrice = symbolSummary.typicalPrice
		const orderPrice = order.price
		const volume = symbolSummary.volume
		const orderVolume = order.amount
		const side = order.side
		const fundsAvailable: number = (this.portfolio as any)[product] || 0

		const buy = (price: number, amount: number) => {
			const tempPortfolio: any = this.portfolio
			if (!tempPortfolio[product]) {
				tempPortfolio[product] = 0
			}
			tempPortfolio[product] -= price * amount
			this.portfolio = tempPortfolio as BacktestClientPortfolio
			symbolSummary.volume -= amount
			order.executed = true
			this.orderQueue.shift()
			this.logger.success(`Bought ${amount} units of ${product} at ${price} each`)
		}

		const sell = (price: number, amount: number) => {
			const tempPortfolio: any = this.portfolio
			if (!tempPortfolio[product]) {
				tempPortfolio[product] = 0
			}
			tempPortfolio[product] += price * amount
			this.portfolio = tempPortfolio as BacktestClientPortfolio
			symbolSummary.volume += amount
			order.executed = true
			this.orderQueue.shift()
			this.logger.success(`Sold ${amount} units of ${product} at ${price} each`)
		}

		const adjustedPrice = orderVolume * actualPrice

		if (order.type === OrderType.LIMIT) {
			if (
				side === OrderSide.BUY &&
				actualPrice <= orderPrice &&
				fundsAvailable >= adjustedPrice &&
				volume > orderVolume
			) {
				buy(actualPrice, orderVolume)
			} else if (side === OrderSide.SELL && actualPrice >= orderPrice) {
				sell(actualPrice, orderVolume)
			} else {
				let message = `Not executing ${side} LIMIT order ${order.id}`
				if (side === OrderSide.BUY) {
					message += `, order price $${orderPrice} exceeds $${orderPrice} actual price or volume insufficient`
				} else if (side === OrderSide.SELL) {
					message += `, actual price $${actualPrice} exceeds $${orderPrice} order price or volume insufficient`
				}
				this.logger.warning(message)
			}
		} else if (order.type === OrderType.STOP) {
			if (
				side === OrderSide.BUY &&
				actualPrice > orderPrice &&
				fundsAvailable >= adjustedPrice &&
				volume > orderVolume
			) {
				buy(actualPrice, orderVolume)
			} else if (side === OrderSide.SELL && actualPrice < orderPrice) {
				sell(actualPrice, orderVolume)
			} else {
				let message = `Not executing ${side} STOP order ${order.id}`
				if (side === OrderSide.BUY) {
					message += `, actual price $${actualPrice} exceeds $${orderPrice} order price or volume insufficient`
				} else if (side === OrderSide.SELL) {
					message += `, order price $${orderPrice} exceeds $${orderPrice} actual price or volume insufficient`
				}
				this.logger.warning(message)
			}
		} else if (order.type === OrderType.MARKET) {
			if (side === OrderSide.BUY && fundsAvailable >= adjustedPrice && volume > orderVolume) {
				buy(actualPrice, orderVolume)
			} else if (side === OrderSide.SELL) {
				sell(actualPrice, orderVolume)
			} else {
				let message = `Not executing ${side} MARKET order ${order.id}`
				if (side === OrderSide.BUY) {
					message += `, $${adjustedPrice} exceeds $${fundsAvailable} available funds or volume insufficient`
				}
				this.logger.warning(message)
			}
		} else {
			throw new Error(`Order type ${order.type} not supported in backtesting`)
		}

		this.orders.set(orderId, order)

		this.logger.info(`Set ${order.executed ? 'COMPLETE' : 'INCOMPLETE'} status on order ${orderId}`)
	}

	/**
	 * Private order placement wrapper for Gemini API.
	 * @param side Buy/sell.
	 * @param symbol The symbol for the new order.
	 * @param amount Quoted decimal amount to purchase.
	 * @param price Quoted decimal amount to spend per unit.
	 * @param type The type of order to execute.
	 * @param stop The stop rule for the order (loss or entry).
	 * @param stopPrice The stop price for the order.
	 */
	private async placeOrder(
		side: OrderSide,
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
	): Promise<OrderResponse> {
		const id = Object.keys(this.orders).length.toString()
		const order: HistoricalTrade = {
			id,
			side,
			price,
			amount,
			timestamp: new Date().getTime(),
			type,
			symbol,
			executed: false,
		}
		this.orders.set(id, order)
		this.orderQueue.push(id)
		const message = `Backtesting order placed with ID ${id}`
		this.logger.success(message)
		return {
			id,
			status: OrderStatus.SUCCESS,
			message,
		}
	}
}
