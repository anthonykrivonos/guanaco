import { ClientOptions as CoinbaseAPIClientOptions } from 'coinbase-pro'

export interface CoinbaseClientOptions extends CoinbaseAPIClientOptions {
	/**
	 * User's Coinbase API key.
	 */
	key: string

	/**
	 * User's Gemini API secret.
	 */
	secret: string

	/**
	 * User's login passphrase.
	 */
	passphrase: string

	/**
	 * URI of the Coinbase API.
	 */
	apiURI?: string
}
