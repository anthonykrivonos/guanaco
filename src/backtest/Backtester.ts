import { BacktestClient } from '../clients'
import { BacktestClientPortfolio, HistoricalTrade, OrderId } from '../models'
import { Condition, Logger } from '../utils'
import { BacktestDate } from './BacktestDate'
import { BacktestFunction } from './BacktestFunction'
import { BacktestHistorical } from './BacktestHistorical'
import { BacktestInterval } from './BacktestInterval'
import { BacktestSummary } from './BacktestSummary'

/**
 * Runs a strategy starting from a simulated date to the present.
 */
export class Backtester {
	/**
	 * The simulated start date of the backtest.
	 */
	private startDate!: BacktestDate

	/**
	 * The interval the backtest will occur on.
	 */
	private interval!: BacktestInterval

	/**
	 * The interval to execute order on.
	 */
	private executionInterval?: BacktestInterval

	/**
	 * Number of orders to execute at a time.
	 */
	private executionCount?: number

	/**
	 * Logs backtesting progress.
	 */
	private logger!: Logger

	/**
	 * Constructs a Backtester object.
	 * @param startDate The historical date to start the backtesting from.
	 * @param interval The interval in which to backtest on. For instance, if `BacktestInterval.ONE_DAY` is provided, then the algorithm will be run
	 *                 once every historical day.
	 * @param executionInterval The interval in which to execute orders. This is very helpful if your algorithm cancels orders after placing them.
	 *                 If unsure how to use this, leave this `undefined`. Note, this value MUST be equal to or greater than the `interval`.
	 * @param executionCount The number of orders to execute on the execution interval. A value of `1`, for example, will execute the first order in the queue.
	 * @param verbose Optionally logs progress of the backtester.
	 */
	constructor(
		startDate: BacktestDate,
		interval: BacktestInterval = BacktestInterval.ONE_DAY,
		executionInterval?: BacktestInterval,
		executionCount?: number,
		verbose?: boolean,
	) {
		if (Condition.notNull(executionInterval) && interval > executionInterval!) {
			throw new Error('Execution interval cannot be less than the backtest interval.')
		}
		this.startDate = startDate
		this.interval = interval
		this.executionInterval = executionInterval
		this.executionCount = executionCount
		this.logger = Logger.getInstance(verbose)
	}

	public setStartDate(startDate: BacktestDate) {
		this.startDate = startDate
	}

	public setInterval(interval: BacktestInterval) {
		this.interval = interval
	}

	public setExecutionInterval(executionInterval: BacktestInterval) {
		this.executionInterval = executionInterval
	}

	public setExecutionCount(executionCount: number) {
		this.executionCount = executionCount
	}

	/**
	 * Backtest the provided algorithm asynchronously.
	 * @param portfolio Client portfolio containing the starting amounts of each product.
	 * @param algorithm The algorithm to test.
	 */
	public async run(portfolio: BacktestClientPortfolio, algorithm: BacktestFunction) {
		let history: BacktestSummary[] = []
		try {
			this.logger.info(
				`Getting historicals from ${this.startDate.toLocaleDateString()} to ${new Date().toLocaleDateString()}`,
			)
			history = await BacktestHistorical.getHistory(this.interval, this.startDate)
			this.logger.info(`Got history: ${JSON.stringify(history)}`)
		} catch (e) {
			throw new Error(`Error getting historicals for backtesting: ${e.getMessage()}`)
		}
		if (history.length === 0) {
			throw new Error('Could not get historicals for backtesting')
		}
		this.logger.info(`Portolio: ${JSON.stringify(portfolio)}`)
		let orders: Map<OrderId, HistoricalTrade> = new Map()
		let newPortfolio = portfolio
		let nextExecutionTime = this.executionInterval || 0
		history.forEach((summary: BacktestSummary) => {
			const newClient = new BacktestClient(newPortfolio, summary, orders, this.logger.getDebug())
			algorithm(newClient)
			if (Condition.null(this.executionInterval)) {
				newClient.executeOrders(this.executionCount)
			} else {
				nextExecutionTime -= this.executionInterval!
				if (nextExecutionTime < 0) {
					nextExecutionTime *= -1
					newClient.executeOrders(this.executionCount)
				}
			}
			newPortfolio = newClient.getPortfolio()
			orders = newClient.getOrders()
			this.logger.info(`Orders: ${JSON.stringify(orders)}`)
			this.logger.info(`New Portfolio: ${JSON.stringify(newPortfolio)}`)
		})
		const priceDifferences: BacktestClientPortfolio = {}
		for (const product in portfolio) {
			if ((portfolio as object).hasOwnProperty(product)) {
				// @ts-ignore
				priceDifferences[product] = portfolio[product] - newPortfolio[product]
			}
		}
		this.logger.info(`Price differences: ${JSON.stringify(priceDifferences)}`)
		return priceDifferences
	}
}
