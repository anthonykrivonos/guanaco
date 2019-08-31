/**
 * Maps enum values to seconds to use as intervals for backtesting. Some times may not have accurate prices, so the guanaco will do its best.
 */
export enum BacktestInterval {
	ONE_MIN = 60,
	FIVE_MIN = 300,
	FIFTEEN_MIN = 900,
	ONE_HOUR = 3600,
	SIX_HOURS = 21600,
	ONE_DAY = 86400,
}
