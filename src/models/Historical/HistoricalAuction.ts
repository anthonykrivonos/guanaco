import { OrderStatus } from '../Order'

export interface HistoricalAuction {
	/**
	 * Unique ID for the auction.
	 */
	id?: string

	/**
	 * Timestamp of the auction.
	 */
	timestamp?: number

	/**
	 * Is the result an indicative price?
	 */
	isIndicative?: boolean

	/**
	 * Status of the auction.
	 */
	result?: OrderStatus

	/**
	 * Price of the auction.
	 */
	price: number

	/**
	 * Price of the highest bid, if available.
	 */
	highestBidPrice?: number

	/**
	 * Price of the lowest ask, if available.
	 */
	lowestAskPrice?: number

	/**
	 * Price of the collar.
	 * The auction_price must be within plus or minus five percent of the
	 *   collar price for result to be success.
	 */
	collarPrice?: number

	/**
	 * Amount of the order purchased.
	 */
	amount: number
}
