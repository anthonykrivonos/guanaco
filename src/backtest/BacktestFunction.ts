import { BacktestSummary } from "./BacktestSummary";

/**
 * A function that passes in a summary containing the simulated date and mappings of symbols to tickers.
 */
export type BacktestFunction = (summary:BacktestSummary)=>void