import { HistoricalAuction, HistoricalTrade } from './Historical'
import { OrderId, OrderResponse, OrderStop, OrderType } from './Order'
import { Symbol, SymbolInfo } from './Symbol'

export interface Client {
	/**
	 * Instance of the API client.
	 */
	client?: any

	/**
	 * Gets information on the given symbol.
	 * @param symbol The symbol to get information for.
	 */
	info(symbol: Symbol): Promise<SymbolInfo>

	/**
	 * Buy an amount of a symbol for a given price.
	 * @param symbol The symbol for the new order.
	 * @param amount Quoted decimal amount to purchase.
	 * @param price Quoted decimal amount to spend per unit.
	 * @param type Type of order to execute (Market, Stop, Limit, etc.).
	 * @param stop The stop rule for the order (loss or entry).
	 * @param stopPrice The stop price for the order.
	 */
	buy(
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
		stop?: OrderStop,
		stopPrice?: number,
	): Promise<OrderResponse>

	/**
	 * Sell an amount of a symbol for a given price.
	 * @param symbol The symbol for the new order.
	 * @param amount Quoted decimal amount to purchase.
	 * @param price Quoted decimal amount to spend per unit.
	 * @param type Type of order to execute (Market, Stop, Limit, etc.).
	 * @param stop The stop rule for the order (loss or entry).
	 * @param stopPrice The stop price for the order.
	 */
	sell(
		symbol: Symbol,
		amount: number,
		price: number,
		type: OrderType,
		stop?: OrderStop,
		stopPrice?: number,
	): Promise<OrderResponse>

	/**
	 * Cancels an order with the given ID.
	 * @param orderId The ID of the order to be canceled.
	 */
	cancel(orderId: OrderId): Promise<OrderResponse>

	/**
	 * Cancels all open orders for the user.
	 */
	cancelAll(): Promise<OrderResponse>

	/**
	 * Cancels all session session for the user.
	 */
	cancelAllSession?(): Promise<OrderResponse>

	/**
	 * Gets the user's trade history.
	 * @param symbol The symbol to get the trade history for.
	 * @param tail The number of recent orders to limit the history to.
	 */
	getHistory?(symbol?: Symbol, tail?: number): Promise<HistoricalTrade[]>

	/**
	 * Gets the user's auction history for a given symbol.
	 * @param symbol The symbol to get the auction history for.
	 * @param tail The number of recent orders to limit the history to.
	 */
	getAuctionHistory?(symbol: Symbol, tail?: number): Promise<HistoricalAuction[]>
}
