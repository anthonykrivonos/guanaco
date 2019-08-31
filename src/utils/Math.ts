/**
 * Mathematical utility methods for the lazy.
 */
export class Math {
	/**
	 * Gets the typical price given the high, low, and close for a day. It's practically the best single price indicator:
	 * https://www.quora.com/Which-is-the-best-trading-indicator-among-the-OHLC-Average-the-HLC-Average-and-the-closing-price-Or-is-any-other-indicator-more-suitable
	 * @param high The high price for a given day.
	 * @param low The low price for a given day.
	 * @param close The close price for a given day.
	 */
	public static getTypicalPrice(high: number, low: number, close: number) {
		return (high + low + close) / 3
	}
}
