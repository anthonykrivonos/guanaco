# 🦙 Guanaco

<a href="https://www.amazon.com/Amuse-Rainbow-Inches-Stuffed-Llama/dp/B01D2MFUNY" style="display: block;">
    <img src="https://images-na.ssl-images-amazon.com/images/I/61M4e0IVq1L._SY679_.jpg" height="300">
</a>

## A cute and cuddly multi-platform cryptocurrency quant trading engine in TypeScript.

> The guanaco (Lama guanicoe) (from Quechua "Wanaku", via Spanish) is a camelid native to South America, closely related to the llama. Its name comes from the Quechua word huanaco (modern spelling wanaku). - [Wikipedia](https://en.wikipedia.org/wiki/Guanaco)

## 📦 Installation

```
npm install --save guanaco
```
or
```
yarn add guanaco
```

## ✅ It's Easy AF

### Example with [Gemini](https://github.com/mjesuele/gemini-api-node)
1. `yarn add gaunaco`
2. Start trading like a badass.
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

## 💸 Supported Clients

### Current

- [Gemini Node API](https://github.com/mjesuele/gemini-api-node)

### Future

- [ccxt](https://github.com/ccxt/ccxt)

## 👫 Collaboration

If you're interested in collaborating and adding onto the available clients and functionality, please feel free to submit pull requests.

## 📝 Authors

Anthony Krivonos - [Portfolio](https://anthonykrivonos.com) | [GitHub](https://github.com/anthonykrivonos)