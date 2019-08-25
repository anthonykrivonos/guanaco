import { PublicClient } from 'coinbase-pro'
import { Symbol } from '../models'
import { Converter, Math } from '../utils'
import { BacktestDate } from './BacktestDate'
import { BacktestInterval } from './BacktestInterval'
import { BacktestSummary } from './BacktestSummary'

type HistoricalBucketArray = number[]

interface HistoricalBucket {
    time:number,
    low:number,
    high:number,
    open:number,
    close:number,
    volume:number,
}

export class BacktestHistorical {

    public static async getHistory(interval:BacktestInterval, startDate:BacktestDate, endDate:BacktestDate = BacktestDate.today()):Promise<BacktestSummary[]> {
        // Create a Coinbase public client for the data retrieval
        const cbClient = new PublicClient()
        // Get a list of all symbols as products
        const products:string[] = []
        const symbols:Symbol[] = []
        for (const symbol in Symbol) {
            if (symbol as Symbol) {
                const product = Converter.symbolToProduct(symbol as Symbol)
                products.push(product)
                symbols.push(symbol as Symbol)
            }
        }
        // Get the history of all the products
        const historicalBuckets:HistoricalBucketArray[][] = await Promise.all(products.map((product:string) =>
            cbClient.getProductHistoricRates(product, {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                granularity: interval
            })
        ))
        const summaryTimeMap:any = {}
        const summaries:BacktestSummary[] = []
        historicalBuckets.forEach((historicalBucketArray:HistoricalBucketArray[], i:number) => {
            const symbol = symbols[i]
            const history:HistoricalBucket[] = historicalBucketArray.map((histBuckets) => BacktestHistorical.getHistoricalBucket(histBuckets))
            history.forEach((histBucket:HistoricalBucket) => {
                if (summaryTimeMap[histBucket.time] == null) {
                    summaryTimeMap[histBucket.time] = {
                        symbol: histBucket
                    }
                } else {
                    summaryTimeMap[histBucket.time][symbol] = histBucket
                }
            })
        })
        for (const summaryTime in summaryTimeMap) {
            if (summaryTimeMap[summaryTime] != null) {
                const summary:BacktestSummary = {
                    date: new Date(summaryTime)
                }
                for (const symbol in summaryTimeMap[summaryTime]) {
                    if (symbol as Symbol) {
                        const symbolBucket:HistoricalBucket = summaryTimeMap[summaryTime][symbol]
                        summary[symbol as Symbol] = {
                            volume: symbolBucket.volume,
                            typicalPrice: Math.getTypicalPrice(symbolBucket.high, symbolBucket.low, symbolBucket.close),
                        }
                    }
                }
            }
        }
        return summaries
    }

    private static getHistoricalBucket(fromArray:HistoricalBucketArray):HistoricalBucket {
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