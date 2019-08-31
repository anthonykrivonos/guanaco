import { Backtester, BacktestClient, BacktestClientPortfolio, BacktestInterval, OrderType } from '../../src';

const lastMonth = new Date(2019, 7, 30)
const backtestInterval = BacktestInterval.ONE_DAY

let backtester = new Backtester(lastMonth, backtestInterval)

let lastAskPrice = null
backtester.run({ usd: 2400 }, (client:BacktestClient) => {
    const info = client.info('btcusd')
    if (lastAskPrice && lastAskPrice > info.ticker.ask) {
        client.buy('btcusd', 0.25, info.ticker.ask, OrderType.MARKET)
        lastAskPrice = info.ticker.ask
    }
})