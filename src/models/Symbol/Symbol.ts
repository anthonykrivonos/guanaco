/**
 * Symbol to place order on.
 * Structure: 'xxxyyy', where 'xxx' is the price currency and 'yyy' is the quantity currency.
 */
export type Symbol =
	| 'btcusd'
	| 'ethusd'
	| 'ethbtc'
	| 'zecusd'
	| 'zecbtc'
	| 'zeceth'
	| 'zecbch'
	| 'zecltc'
	| 'bchusd'
	| 'bchbtc'
	| 'bcheth'
	| 'ltcusd'
	| 'ltcbtc'
	| 'ltceth'
	| 'ltcbch'

/**
 * Array of symbol strings, for easy access.
 * Caveat: MUST keep this updated with the Symbol enum literal.
 */
export const symbols:any = {
	btcusd: 0,
	ethusd: 1,
	ethbtc: 2,
	zecusd: 3,
	zecbtc: 4,
	zeceth: 5,
	zecbch: 6,
	zecltc: 7,
	bchusd: 8,
	bchbtc: 9,
	bcheth: 10,
	ltcusd: 11,
	ltcbtc: 12,
	ltceth: 13,
	ltcbch: 14,
}

export const symbolExists = (symbol:string) => {
	return symbols[symbol] != null
}