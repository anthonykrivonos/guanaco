import { SymbolVolume } from './SymbolVolume'

/**
 * Information about a symbol's ticker.
 */
export interface SymbolTicker {
	/**
	 * Ask price of the symbol.
	 */
	ask: number

	/**
	 * Bid price of the symbol.
	 */
	bid: number

	/**
	 * Last sold price of the symbol.
	 */
	last: number

	/**
	 * Volume of the symbol.
	 */
	volume: SymbolVolume
}
