import { BacktestClientOptions } from '../models/ClientOptions/BacktestClientOptions'
import { Condition } from '../utils/Condition';
import { BacktestSummary, BacktestSymbolSummary } from '../backtest/BacktestSummary'
import { SymbolInfo } from '../../lib/models/Symbol/SymbolInfo.d'
import { HistoricalTrade, OrderResponse, OrderSide, OrderType, Symbol } from '../models'
import { OrderId, OrderStatus } from '../../lib/models/Order'
import { Converter } from '../utils'

/**
 * Client for fake transactions in backtesting.
 */
export class BacktestClient {

    /**
     * Options object containing amounts of each product.
     */
    private options!:BacktestClientOptions

    /**
     * List of orders made by the backtest client.
     */
    private orders!:Map<OrderId,HistoricalTrade>

    private orderQueue!:OrderId[]

    /**
     * Summary containing the simulated date and mappings of symbols to tickers.
     */
    private summary!:BacktestSummary

	constructor(options: BacktestClientOptions, summary:BacktestSummary, orders?:Map<OrderId,HistoricalTrade>) {
        // Ensure at least one price value is provided for all products
        if (!Condition.hasNotNull(Object.values(options))) {
            throw new Error('Cannot backtest without starting prices')
        }
        this.options = options
        this.summary = summary
        this.orders = orders || new Map()
	}

    // TODO: Extract bid, ask, and last for historical info.
	public info(symbol: Symbol): SymbolInfo {
        const summaryForSymbol:BacktestSymbolSummary = this.summary[symbol.toString()]
		return {
			ticker: {
				bid: summaryForSymbol.typicalPrice,
				ask: summaryForSymbol.typicalPrice,
				last: summaryForSymbol.typicalPrice,
				volume: summaryForSymbol.volume,
			},
		}
	}

	public async buy(
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
	): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.BUY, symbol, amount, price, type)
	}

	public async sell(
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
	): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.SELL, symbol, amount, price, type)
	}

	public async cancel(orderId: OrderId): Promise<OrderResponse> {
        if (this.orders.has(orderId)) {
            const order = this.orders.get(orderId)!
            if (!order.executed) {
                order.executed = true
                this.orders.set(order.id, order)
                for (let i = 0; i < this.orderQueue.length; i++) {
                    if (this.orderQueue[i] == order.id) {
                        this.orderQueue.splice(i, 1)
                        break
                    }
                }
                return {
                    message: `Successfully cancelled backtest order with id ${orderId}`,
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
		this.orderQueue.forEach((orderId:OrderId) => {
            const order = this.orders.get(orderId)!
            order.executed = true
            this.orders.set(order.id, order)
        })
        this.orderQueue = []
        return {
            message: "Successfully cancelled all backtest orders",
            status: OrderStatus.SUCCESS,
        }
	}

	public getHistory(): HistoricalTrade[] {
		return Object.values(this.orders).sort((a:HistoricalTrade, b:HistoricalTrade) => parseInt(a.id.toString()) - parseInt(b.id.toString()))
    }
    
    public getOptions():BacktestClientOptions {
        return this.options
    }
    
    public getOrders():Map<OrderId,HistoricalTrade> {
        return this.orders
    }

    /**
     * Execute in-progress orders, if possible.
     * @param count The number of orders to execute.
     */
    public executeOrders(count?:number) {
        let ordersToExecute = count || this.orderQueue.length
        while (this.orderQueue.length > 0 && ordersToExecute > 0) {
            const nextOrderId:OrderId = this.orderQueue.shift()!
            const order:HistoricalTrade = this.orders.get(nextOrderId)!
            const symbolSummary:BacktestSymbolSummary = this.summary[order.symbol!.toString()]
            const product = Converter.symbolToProducts(order.symbol!)![0]
            const price = symbolSummary.typicalPrice
            const volume = symbolSummary.volume
            const productValue:number = (this.options as any)[product] || 0
            if (productValue > price && volume > order.amount) {
                (this.options as any)[product] -= price
                symbolSummary.volume -= order.amount
                order.executed = true
            } else {
                order.executed = false
            }
            this.orders.set(nextOrderId, order)
            ordersToExecute--
        }
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
		const order:HistoricalTrade = {
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
        return {
            id,
            status: OrderStatus.SUCCESS,
            message: "Backtesting order placed",
        }
	}

}