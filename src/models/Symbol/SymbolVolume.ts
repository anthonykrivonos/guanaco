/**
 * Volume of a given symbol.
 */
export interface SymbolVolume {
	/**
	 * Note: Also contains a price symbol AND a quantity symbol, i.e. USD and BTC.
	 */

	/** The timestamp the volume was recorded on. */
	timestamp: number
}
