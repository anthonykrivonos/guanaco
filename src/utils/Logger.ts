import { Condition } from './Condition'

/**
 * Instance of the logger.
 */
let instance: Logger | null = null

/**
 * Logger singleton factory.
 */
export class Logger {
	/**
	 * Returns a Logger singleton.
	 * Recreates the singleton if a different debugging specification is provided.
	 */
	public static getInstance(debug?: boolean): Logger {
		if (Condition.null(instance) || (Condition.notNull(debug) && instance!.getDebug() !== debug)) {
			instance = new Logger(debug)
		}
		return instance!
	}

	/**
	 * Map of colors for better logging UI.
	 */
	private static COLORS = {
		NORMAL: '\x1b[0m',
		RED: '\x1b[31m',
		GREEN: '\x1b[32m',
		YELLOW: '\x1b[33m',
		BLUE: '\x1b[34m',
	}

	/**
	 * A boolean describing whether or not messages should be outputted
	 */
	private debug: boolean = false

	constructor(debug?: boolean) {
		if (Condition.notNull(debug)) {
			this.debug = debug!
		}
	}

	/**
	 * Returns true if debug logging is enabled, false otherwise.
	 */
	public getDebug(): boolean {
		return this.debug
	}

	/**
	 * Logs a blue info message into the console.
	 * @param message The info message to log.
	 */
	public info(...message: any[]): void {
		this.log(Logger.COLORS.BLUE, message)
	}

	/**
	 * Logs a green success message into the console.
	 * @param message The success message to log.
	 */
	public success(...message: any[]): void {
		this.log(Logger.COLORS.GREEN, message)
	}

	/**
	 * Logs a red error message into the console.
	 * @param message The error message to log.
	 */
	public error(...message: any[]): void {
		this.log(Logger.COLORS.RED, message)
	}

	/**
	 * Logs a yellow warning message into the console.
	 * @param message The warning message to log.
	 */
	public warning(...message: any[]): void {
		this.log(Logger.COLORS.YELLOW, message)
	}

	/**
	 * Log a message into the console with the specified color.
	 * @param message The message to log.
	 * @param color The color of the message to log.
	 */
	private log(color: string, ...messages: any[]): void {
		const msgs: string = messages.join(' ')
		// Ignore "Calls to 'console.log' are not allowed."
		// tslint:disable-next-line:no-console
		console.log(`${new Date().toLocaleTimeString()}:`, color, msgs, Logger.COLORS.NORMAL)
	}
}
