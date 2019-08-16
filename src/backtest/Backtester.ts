import { BacktestDate } from "./BacktestDate"
import { BacktestFunction } from "./BacktestFunction"
import { BacktestHistorical } from "./BacktestHistorical"
import { BacktestInterval } from "./BacktestInterval"
import { BacktestSummary } from "./BacktestSummary"

/**
 * Runs a strategy starting from a simulated date to the present.
 */
export class BackTester {

    /**
     * The simulated start date of the backtest.
     */
    private startDate!:BacktestDate

    /**
     * The interval the backtest will occur on.
     */
    private interval!:BacktestInterval

    constructor(startDate:BacktestDate, interval:BacktestInterval = BacktestInterval.ONE_DAY) {
        this.startDate = startDate
        this.interval = interval
    }

    public setStartDate(startDate:BacktestDate) {
        this.startDate = startDate
    }

    public setInterval(interval:BacktestInterval) {
        this.interval = interval
    }

    /**
     * Backtest the provided algorithm asynchronously.
     * @param The algorithm to test.
     */
    public async run(algorithm:BacktestFunction) {
        // Initialize dates as timestamps
        const history = await BacktestHistorical.getHistory(this.interval, this.startDate)
        history.forEach((summary:BacktestSummary) => {
            algorithm(summary)
        })
    }

}