# <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/198/llama_1f999.png" width="30px" height="30px" ondragstart="return false"> Guanaco

<a href="https://www.amazon.com/Amuse-Rainbow-Inches-Stuffed-Llama/dp/B01D2MFUNY" style="display: block;">
    <img src="https://images-na.ssl-images-amazon.com/images/I/61M4e0IVq1L._SY679_.jpg" height="300">
</a>

## A cute and cuddly cryptocurrency quant trading engine in TypeScript.

> The guanaco (Lama guanicoe) (from Quechua "Wanaku", via Spanish) is a camelid native to South America, closely related to the llama. Its name comes from the Quechua word huanaco (modern spelling wanaku). - [Wikipedia](https://en.wikipedia.org/wiki/Guanaco)

## ✨ Features

- **Live**, schedule-based trading
- Algorithm **backtesting**
- **Same source code** for <u>all</u> clients
- ... and many more to come!


## 📦 Installation

```
npm install --save guanaco
```
or
```
yarn add guanaco
```

## ✅ It's Easy AF

### Live Trading Example with [Gemini](https://github.com/mjesuele/gemini-api-node)
1. `yarn add gaunaco`
2. Paste and start trading like a badass.
```
import { GeminiClient, Scheduler } from 'guanaco'

const geminiClient = GeminiClient({
    key: 'my-key',
    secret: 'my-secret'
})

let lastPrice = 0

// Schedule every hour
Scheduler.hourInterval(() => {
    geminiClient.info('btcusd').then((info) => {
        // Not-so-great strategy here
        const change = (info.ticker.last - lastPrice)/lastPrice
        if (change > 0.05) {
            geminiClient.sell('btcusd', 20, 50)
        }
        lastPrice = info.ticker.last
    })
}, 1)
```

### 🕗 Backtesting Example
1. `yarn add gaunaco`
2. Determine your start date and interval of trading.
3. Run your algorithm with the starting portfolio of your choice (here, we start with $2400).
4. Asynchronously get your results!
```
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
}).then((result) => {
    console.log(`We earned ${result.usd!}!`)
})
```

## 💸 Supported Clients

### Current

- [Gemini Node API](https://github.com/mjesuele/gemini-api-node)
- [Coinbase Pro API](https://github.com/coinbase/coinbase-pro-node)

### Future

- [ccxt](https://github.com/ccxt/ccxt)

## 👫 Collaboration

If you're interested in collaborating and adding onto the available clients and functionality, please feel free to submit pull requests.

## 📝 Authors

Anthony Krivonos - [Portfolio](https://anthonykrivonos.com) | [GitHub](https://github.com/anthonykrivonos)