import GeminiAPI, {
	AccountTradesEntry,
	AuctionHistoryEntry,
	OrderStatus as GeminiOrderStatus,
	Ticker,
} from 'gemini-api'
import {
	Client,
	GeminiClientOptions,
	HistoricalAuction,
	HistoricalTrade,
	OrderId,
	OrderResponse,
	OrderSide,
	OrderStatus,
	OrderType,
	Symbol,
	SymbolInfo,
} from '../models'
import { Converter } from '../utils'

/**
 * Client for the Gemini API.
 */
export class GeminiClient implements Client {
	public static EXCHANGE_LIMIT: 'exchange limit' = 'exchange limit'

	public client!: GeminiAPI

	constructor(options: GeminiClientOptions) {
		this.client = new GeminiAPI(options)
	}

	public async info(symbol: Symbol): Promise<SymbolInfo> {
		const ticker: Ticker = await this.client.getTicker(symbol)
		return {
			ticker: {
				bid: Converter.strToNum(ticker.bid),
				ask: Converter.strToNum(ticker.ask),
				last: Converter.strToNum(ticker.last),
				volume: ticker.volume,
			},
		}
	}

	public async buy(symbol: Symbol, amount: number, price: number, type: OrderType): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.BUY, symbol, amount, price, type)
	}

	public async sell(symbol: Symbol, amount: number, price: number, type: OrderType): Promise<OrderResponse> {
		return this.placeOrder(OrderSide.BUY, symbol, amount, price, type)
	}

	public async cancel(orderId: OrderId): Promise<OrderResponse> {
		try {
			const status: GeminiOrderStatus = await this.client.cancelOrder({
				client_order_id: orderId.toString(),
			})
			return {
				status: OrderStatus.SUCCESS,
				message: JSON.stringify(status),
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
			const { result } = await this.client.cancelAllActiveOrders()
			const didCancel: boolean = result
			if (didCancel) {
				return {
					status: OrderStatus.SUCCESS,
					message: JSON.stringify(status),
				}
			} else {
				return {
					status: OrderStatus.CLIENT_FAILURE,
					message: 'Could not cancel open orders.',
				}
			}
		} catch (message) {
			return {
				status: OrderStatus.CLIENT_FAILURE,
				message,
			}
		}
	}

	public async cancelAllSession(): Promise<OrderResponse> {
		try {
			const { result } = await this.client.cancelAllSessionOrders()
			const didCancel: boolean = result
			if (didCancel) {
				return {
					status: OrderStatus.SUCCESS,
					message: JSON.stringify(status),
				}
			} else {
				return {
					status: OrderStatus.CLIENT_FAILURE,
					message: 'Could not cancel session orders.',
				}
			}
		} catch (message) {
			return {
				status: OrderStatus.CLIENT_FAILURE,
				message,
			}
		}
	}

	public async getHistory(symbol: Symbol, tail: number = 50): Promise<HistoricalTrade[]> {
		const history: AccountTradesEntry[] = await this.client.getMyPastTrades({
			symbol,
			limit_trades: tail,
		})
		return history.map((entry: AccountTradesEntry) => ({
			id: entry.order_id,
			price: Converter.strToNum(entry.price),
			amount: Converter.strToNum(entry.amount),
			timestamp: entry.timestamp,
			type: (OrderSide as any)[entry.type],
			aggressor: entry.aggressor,
			feeCurrency: entry.fee_currency,
			feeAmount: Converter.strToNum(entry.fee_amount),
		}))
	}

	public async getAuctionHistory(symbol: Symbol, tail: number = 50): Promise<HistoricalAuction[]> {
		const history: AuctionHistoryEntry[] = await this.client.getAuctionHistory(symbol, {
			limit_auction_results: tail,
			include_indicative: true,
			since: 0,
		})
		return history.map((entry: AuctionHistoryEntry) => ({
			id: Converter.numToStr(entry.auction_id),
			timestamp: entry.timestamp,
			isIndicative: entry.event_type === 'indicative',
			result:
				entry.auction_result && entry.auction_result === 'success'
					? OrderStatus.SUCCESS
					: OrderStatus.CLIENT_FAILURE,
			price: Converter.strToNum(entry.auction_price),
			highestBidPrice: Converter.strToNum(entry.highest_bid_price),
			lowestAskPrice: Converter.strToNum(entry.lowest_ask_price),
			collarPrice: Converter.strToNum(entry.collar_price),
			amount: Converter.strToNum(entry.auction_quantity),
		}))
	}

	/**
	 * Private order placement wrapper for Gemini API.
	 * @param side Buy/sell.
	 * @param symbol The symbol for the new order.
	 * @param amount Quoted decimal amount to purchase.
	 * @param price Quoted decimal amount to spend per unit.
	 * @param type The type of order to execute.
	 */
	private async placeOrder(
		side: OrderSide,
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
	): Promise<OrderResponse> {
		try {
			if (type === OrderType.LIMIT || type === OrderType.MARKET || type === OrderType.STOP) {
				throw new Error(
					'Improper order type specified to GeminiClient. Must be one of (LIMIT_AUCTION_ONLY, LIMIT_IMMEDIATE_OR_CANCEL, or LIMIT_MAKER_OR_CANCEL)',
				)
			}
			const orderResult = await this.client.newOrder({
				amount: Converter.numToStr(amount),
				options: type,
				price: Converter.numToStr(price),
				side,
				symbol,
				type: GeminiClient.EXCHANGE_LIMIT,
			})
			return {
				id: orderResult.order_id,
				status: OrderStatus.SUCCESS,
			}
		} catch (message) {
			return {
				message,
				status: OrderStatus.CLIENT_FAILURE,
			}
		}
	}
}
