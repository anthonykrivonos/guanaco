import { OrderId, OrderSide, OrderType } from '../Order'
import { Symbol } from '../Symbol'

export interface HistoricalTrade {
	/**
	 * Unique identifier for the trade.
	 */
	id: OrderId

	/**
	 * The symbol that was traded.
	 */
	symbol?: Symbol

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
	 * Side of the order.
	 */
	side: OrderSide

	/**
	 * Type of the order.
	 */
	type?: OrderType

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

	/**
	 * Was the trade executed?
	 */
	executed: boolean
}
