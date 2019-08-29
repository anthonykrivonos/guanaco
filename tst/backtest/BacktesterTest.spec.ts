import { BackTester } from '../../src/backtest/Backtester';
import { BacktestInterval } from '../../src/backtest/BacktestInterval';
import { BacktestClientOptions } from '../../src/models/ClientOptions/BacktestClientOptions';
import { BacktestClient } from '../../src'

let backtester = new BackTester(new Date(2019, 7, 1), BacktestInterval.ONE_DAY)

let backtestOptions:BacktestClientOptions = {
    usd: 200
}

backtester.run(backtestOptions, (client:BacktestClient) => {
    const info = client.info('btcusd')
    console.log(info)
})