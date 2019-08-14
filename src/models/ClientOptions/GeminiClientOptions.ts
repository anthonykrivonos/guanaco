import { RestClientOptions as GeminiAPIClientOptions } from 'gemini-api'

export interface GeminiClientOptions extends GeminiAPIClientOptions {
	/**
	 * User's Gemini API key.
	 */
	key: string

	/**
	 * User's Gemini API secret.
	 */
	secret: string

	/**
	 * Use API in sandbox mode?
	 */
	sandbox?: boolean
}
