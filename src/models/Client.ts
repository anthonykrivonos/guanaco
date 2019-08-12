import { HistoricalAuction, HistoricalTrade } from './Historical'
import { OrderId, OrderResponse } from './Order'
import { OrderExecutionOption } from './Order/OrderExecutionOption'
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
	 * @param options An optional value containing at most one supported order execution option. See Order execution options for details.
	 */
	buy(symbol: Symbol, amount: number, price: number, option?: OrderExecutionOption): Promise<OrderResponse>

	/**
	 * Sell an amount of a symbol for a given price.
	 * @param symbol The symbol for the new order.
	 * @param amount Quoted decimal amount to purchase.
	 * @param price Quoted decimal amount to spend per unit.
	 * @param options An optional value containing at most one supported order execution option. See Order execution options for details.
	 */
	sell(symbol: Symbol, amount: number, price: number, option?: OrderExecutionOption): Promise<OrderResponse>

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
	cancelAllSession(): Promise<OrderResponse>

	/**
	 * Gets the user's trade history for a given symbol.
	 * @param symbol The symbol to get the trade history for.
	 * @param tail The number of recent orders to limit the history to.
	 */
	getHistory?(symbol: Symbol, tail?: number): Promise<HistoricalTrade[]>

	/**
	 * Gets the user's auction history for a given symbol.
	 * @param symbol The symbol to get the auction history for.
	 * @param tail The number of recent orders to limit the history to.
	 */
	getAuctionHistory?(symbol: Symbol, tail?: number): Promise<HistoricalAuction[]>
}
