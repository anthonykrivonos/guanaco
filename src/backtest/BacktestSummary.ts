/**
 * A summary of prices for a given date. Contains a mapping of different symbols to tickers/info.
 */
export interface BacktestSummary {
	/**
	 * The simulated date of the summary.
	 */
	date: Date

	/**
	 * Rest: mappings of symbol to Typical Price.
	 */
	[rest: string]: BacktestSymbolSummary | any
}

export interface BacktestSymbolSummary {
	/**
	 * Volume of the symbol.
	 */
	volume: number

	/**
	 * Typical price of the symbol. (high + low + close)/3
	 */
	typicalPrice: number
}
