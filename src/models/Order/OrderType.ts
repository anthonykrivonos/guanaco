/**
 * Type of rule to execute during an order.
 */
export enum OrderType {
	/**
	 * Filled immediately against resting orders at the current best available price.
	 */
	MARKET = 'market',

	/**
	 * Similar to market orders in that they are orders to buy or sell an asset at the
	 * best available price, but these orders are only processed if the market reaches
	 * a specific price.
	 */
	STOP = 'stop',

	/**
	 * Filled at or better than a specified price. Any quantity that is not filled rests
	 * on the continuous order book until it is filled or canceled.
	 */
	LIMIT = 'limit',

	/**
	 * *(Gemini-Only*)
	 * Rests on the continuous order book at a specified price. If any quantity can be
	 * filled immediately, the entire order is canceled.
	 */
	LIMIT_MAKER_OR_CANCEL = 'maker-or-cancel',

	/**
	 * *(Gemini-Only*)
	 * Filled immediately at or better than a specified price. Any quantity that is not
	 * filled immediately is canceled and does not rest on the continuous order book.
	 */
	LIMIT_IMMEDIATE_OR_CANCEL = 'immediate-or-cancel',

	/**
	 * *(Gemini-Only*)
	 * Rests on the auction order book and is filled at or better than a specified price
	 * at the conclusion of an auction. Any quantity that is not filled is canceled.
	 */
	LIMIT_AUCTION_ONLY = 'auction-only',
}
