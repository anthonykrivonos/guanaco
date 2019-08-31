import { PublicClient } from 'coinbase-pro'
import { Symbol, symbolExists } from '../models'
import { Condition, Converter, Math } from '../utils'
import { BacktestDate } from './BacktestDate'
import { BacktestInterval } from './BacktestInterval'
import { BacktestSummary } from './BacktestSummary'

type HistoricalBucketArray = number[]

interface HistoricalBucket {
	time: number
	low: number
	high: number
	open: number
	close: number
	volume: number
}

export class BacktestHistorical {
	/**
	 * Returns a promise list of BacktestSummarys from the start date to the end date on the specified interval.
	 * This function may take a while as a second between each API call is necessary to avoid 429 Errors from Coinbase Pro.
	 * @param interval The interval to follow between the start date and end date.
	 * @param startDate The start date to get historicals from.
	 * @param endDate The end date to get historicals until.
	 */
	public static async getHistory(
		interval: BacktestInterval,
		startDate: BacktestDate,
		endDate: BacktestDate = BacktestDate.today(),
	): Promise<BacktestSummary[]> {
		// Create a Coinbase public client for the data retrieval
		const cbClient = new PublicClient()
		// Get a list of all symbols as products
		const products: string[] = (await cbClient.getProducts()).map(p => p.id)
		const symbols: Symbol[] = []
		products.forEach(product => {
			products.push(product)
			const symbol = Converter.productToSymbol(product)
			symbols.push(symbol)
		})
		const datesForHistory: Date[] = []
		let tempDate = startDate
		while (tempDate.getTime() < endDate.getTime()) {
			const newTime = tempDate.getTime() + BacktestHistorical.AGGREGATION_LIMIT * interval * 1000
			datesForHistory.push(tempDate)
			tempDate = new Date(newTime)
		}
		if (datesForHistory.length === 0) {
			datesForHistory.push(startDate)
		}
		datesForHistory.push(endDate)
		const historicalBucketPromises: Array<Promise<HistoricalBucketArray[]>> = []
		products.forEach((product: string, index: number) => {
			for (let i = 0; i < datesForHistory.length - 1; i++) {
				historicalBucketPromises.push(
					new Promise((resolve, reject) => {
						try {
							setTimeout(() => {
								cbClient
									.getProductHistoricRates(product, {
										start: datesForHistory[i].toISOString(),
										end: datesForHistory[i + 1].toISOString(),
										granularity: interval,
									})
									.then(resolve)
									.catch(reject)
							}, BacktestHistorical.AGGREGATION_TIMEOUT_MS * (i + 1) * (index + 1))
						} catch (e) {
							reject(e)
						}
					}),
				)
			}
		})
		// Get the history of all the products
		const historicalBuckets: HistoricalBucketArray[][] = await Promise.all(historicalBucketPromises)
		const summaryTimeMap: any = {}
		const summaries: BacktestSummary[] = []
		historicalBuckets.forEach((historicalBucketArray: HistoricalBucketArray[], i: number) => {
			const symbol = symbols[i]
			const history: HistoricalBucket[] = historicalBucketArray.map(histBuckets =>
				BacktestHistorical.getHistoricalBucket(histBuckets),
			)
			history.forEach((histBucket: HistoricalBucket) => {
				if (Condition.null(summaryTimeMap[histBucket.time])) {
					summaryTimeMap[histBucket.time] = {
						symbol: histBucket,
					}
				} else {
					summaryTimeMap[histBucket.time][symbol] = histBucket
				}
			})
		})
		for (const summaryTime in summaryTimeMap) {
			if (Condition.notNull(summaryTimeMap[summaryTime])) {
				const summary: BacktestSummary = {
					date: new Date(((summaryTime as any) as number) * 1000),
				}
				for (const symbol in summaryTimeMap[summaryTime]) {
					if (symbolExists(symbol)) {
						const symbolBucket: HistoricalBucket = summaryTimeMap[summaryTime][symbol]
						summary[symbol as Symbol] = {
							volume: symbolBucket.volume,
							typicalPrice: Math.getTypicalPrice(symbolBucket.high, symbolBucket.low, symbolBucket.close),
						}
					}
				}
				summaries.push(summary)
			}
		}
		return summaries
	}

	/**
	 * DO NOT CHANGE.
	 * The number of historical points Coinbase Pro limits per API call.
	 */
	private static AGGREGATION_LIMIT = 300

	/**
	 * DO NOT CHANGE.
	 * The number of milliseconds before making a subsequent API call to Coinbase Pro.
	 */
	private static AGGREGATION_TIMEOUT_MS = 1000

	private static getHistoricalBucket(fromArray: HistoricalBucketArray): HistoricalBucket {
		return {
			time: fromArray[0],
			low: fromArray[1],
			high: fromArray[2],
			open: fromArray[3],
			close: fromArray[4],
			volume: fromArray[5],
		}
	}
}
