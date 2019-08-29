import { BacktestDate } from "./BacktestDate"
import { BacktestFunction } from "./BacktestFunction"
import { BacktestHistorical } from "./BacktestHistorical"
import { BacktestInterval } from "./BacktestInterval"
import { BacktestSummary } from "./BacktestSummary"
import { BacktestClientOptions, OrderId, HistoricalTrade } from '../models'
import { BacktestClient } from '../clients'
import { Condition } from "../utils";

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

    /**
     * The interval to execute order on.
     */
    private executionInterval?:BacktestInterval

    /**
     * Number of orders to execute at a time.
     */
    private executionCount?:number

    /**
     * Constructs a Backtester object.
     * @param startDate The historical date to start the backtesting from.
     * @param interval The interval in which to backtest on. For instance, if `BacktestInterval.ONE_DAY` is provided, then the algorithm will be run
     *                 once every historical day.
     * @param executionInterval The interval in which to execute orders. This is very helpful if your algorithm cancels orders after placing them.
     *                 If unsure how to use this, leave this `undefined`. Note, this value MUST be equal to or greater than the `interval`.
     * @param executionCount The number of orders to execute on the execution interval. A value of `1`, for example, will execute the first order in the queue.
     */
    constructor(startDate:BacktestDate, interval:BacktestInterval = BacktestInterval.ONE_DAY, executionInterval?:BacktestInterval, executionCount?:number) {
        if (Condition.notNull(executionInterval) && interval > executionInterval!) {
            throw new Error('Execution interval cannot be less than the backtest interval.')
        }
        this.startDate = startDate
        this.interval = interval
        this.executionInterval = executionInterval
        this.executionCount = executionCount
    }

    public setStartDate(startDate:BacktestDate) {
        this.startDate = startDate
    }

    public setInterval(interval:BacktestInterval) {
        this.interval = interval
    }

    public setExecutionInterval(executionInterval:BacktestInterval) {
        this.executionInterval = executionInterval
    }

    public setExecutionCount(executionCount:number) {
        this.executionCount = executionCount
    }

    /**
     * Backtest the provided algorithm asynchronously.
     * @param options Client options containing the starting amounts of each product.
     * @param algorithm The algorithm to test.
     */
    public async run(options:BacktestClientOptions, algorithm:BacktestFunction) {
        const history = await BacktestHistorical.getHistory(this.interval, this.startDate)
        if (history.length == 0) {
            throw new Error('Could not get historicals for backtesting')
        }
        let orders:Map<OrderId,HistoricalTrade> = new Map()
        let productPrices = options
        let nextExecutionTime = this.executionInterval || 0
        history.forEach((summary:BacktestSummary) => {
            const newClient = new BacktestClient(productPrices, summary, orders)
            algorithm(newClient)
            if (Condition.notNull(this.executionInterval)) {
                newClient.executeOrders(this.executionCount)
            } else {
                nextExecutionTime -= this.executionInterval!
                if (nextExecutionTime < 0) {
                    nextExecutionTime *= -1
                    newClient.executeOrders(this.executionCount)
                }
            }
            productPrices = newClient.getOptions()
            orders = newClient.getOrders()
        })
        let priceDifferences:BacktestClientOptions = {}
        for (const product in options) {
            if ((options as object).hasOwnProperty(product)) {
                // @ts-ignore
                priceDifferences[product] = options[product] - productPrices[product]
            }
        }
        return priceDifferences
    }

}