/**
 * A summary of prices for a given date. Contains a mapping of different symbols to tickers/info.
 */
export interface BacktestSummary {

    /**
     * The simulated date of the summary.
     */
    date:Date

    /**
     * Rest: mappings of symbol to Typical Price.
     */
    [rest: string]: any

}