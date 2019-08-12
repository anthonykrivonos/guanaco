import { OrderType } from '../Order'

export interface HistoricalTrade {
	/**
	 * Unique identifier for the trade.
	 */
	id?: string

	/**
	 * Price of the order.
	 */
	price: number

	/**
	 * Amount of the order purchased.
	 */
	amount: number

	/**
	 * Timestamp of the order.
	 */
	timestamp?: number

	/**
	 * Type of the order (buy/sell).
	 */
	type: OrderType

	/**
	 * If true, this order was the taker in the trade.
	 */
	aggressor?: boolean

	/**
	 * Currency that the fee was paid in.
	 */
	feeCurrency?: string

	/**
	 * Amount charged to the aggressor.
	 */
	feeAmount?: number
}
