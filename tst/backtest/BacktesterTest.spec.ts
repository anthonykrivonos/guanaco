import { BackTester } from '../../src/backtest/Backtester';
import { BacktestInterval } from '../../src/backtest/BacktestInterval';
import { BacktestClientOptions } from '../../src/models/ClientOptions/BacktestClientOptions';
import { BacktestClient } from '../../src';

let backtester = new BackTester(new Date(2018, 1, 1), BacktestInterval.ONE_DAY)

let backtestOptions:BacktestClientOptions = {
    usd: 200
}

backtester.run(backtestOptions, (client:BacktestClient) => {

    console.log(client.info('btcusd').ticker.ask)
    
}).then((backtestDelta) => console.log(backtestDelta))