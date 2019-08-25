import { AuthenticatedClient as CoinbaseAPI, OrderInfo, OrderParams, OrderResult, ProductTicker } from 'coinbase-pro'
import {
	Client,
	CoinbaseClientOptions,
	HistoricalTrade,
	OrderId,
	OrderResponse,
	OrderSide,
	OrderStatus,
	OrderStop,
	OrderType,
	Symbol,
	SymbolInfo,
} from '../models'
import { Converter } from '../utils'

/**
 * Client for the Coinbase Pro API.
 */
export class CoinbaseClient implements Client {
	public client!: CoinbaseAPI

	constructor(options: CoinbaseClientOptions) {
		this.client = new CoinbaseAPI(options.key, options.secret, options.passphrase, options.apiURI)
	}

	public async info(symbol: Symbol): Promise<SymbolInfo> {
		const product: string = Converter.symbolToProduct(symbol)
		const ticker: ProductTicker = await this.client.getProductTicker(product)
		return {
			ticker: {
				bid: Converter.strToNum(ticker.bid),
				ask: Converter.strToNum(ticker.ask),
				last: Converter.strToNum(ticker.price),
				volume: ticker.volume,
			},
		}
	}

	public async buy(
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
		stop?: OrderStop,
		stopPrice?: number,
	): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.BUY, symbol, amount, price, type, stop, stopPrice)
	}

	public async sell(
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
		stop?: OrderStop,
		stopPrice?: number,
	): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.SELL, symbol, amount, price, type, stop, stopPrice)
	}

	public async cancel(orderId: OrderId): Promise<OrderResponse> {
		try {
			const results: string[] = await this.client.cancelOrder(orderId.toString())
			return {
				status: OrderStatus.SUCCESS,
				message: results.join(', '),
			}
		} catch (message) {
			return {
				status: OrderStatus.CLIENT_FAILURE,
				message,
			}
		}
	}

	public async cancelAll(): Promise<OrderResponse> {
		try {
			const results: string[] = await this.client.cancelAllOrders({})
			return {
				status: OrderStatus.SUCCESS,
				message: results.join(', '),
			}
		} catch (message) {
			return {
				status: OrderStatus.CLIENT_FAILURE,
				message,
			}
		}
	}

	public async getHistory(): Promise<HistoricalTrade[]> {
		const orders: OrderInfo[] = await this.client.getOrders()
		return orders.map((order: OrderInfo) => ({
			id: order.id,
			price: Converter.strToNum(order.price),
			amount: Converter.strToNum(order.size),
			timestamp: new Date(order.done_at).getTime(),
			type: (OrderSide as any)[order.type],
			executed: order.settled,
			side: order.side as OrderSide,
		}))
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
		stop?: OrderStop,
		stopPrice?: number,
	): Promise<OrderResponse> {
		if (
			type === OrderType.LIMIT_AUCTION_ONLY ||
			type === OrderType.LIMIT_IMMEDIATE_OR_CANCEL ||
			type === OrderType.LIMIT_MAKER_OR_CANCEL
		) {
			throw new Error(
				'Improper order type specified to GeminiClient. Must be one of (LIMIT_AUCTION_ONLY, LIMIT_IMMEDIATE_OR_CANCEL, or LIMIT_MAKER_OR_CANCEL)',
			)
		}
		const params: OrderParams = {
			product_id: Converter.symbolToProduct(symbol),
			// @ts-ignore
			type: type.toString(),
			price: Converter.numToStr(price),
			stop_price: stopPrice ? Converter.numToStr(stopPrice) : undefined,
			size: Converter.numToStr(amount),
			stop,
			side,
		}
		const orderResult: OrderResult = await (side === OrderSide.BUY
			? this.client.buy(params)
			: this.client.sell(params))
		return {
			id: orderResult.id,
			message: JSON.stringify(orderResult),
			status: OrderStatus.SUCCESS,
		}
	}
}
