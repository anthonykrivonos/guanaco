/**
 * Class that permits interval representation.
 */
export class Interval<T> {
	/**
	 * Number or range.
	 */
	private expression: T

	/**
	 * Interval value.
	 */
	private interval: number

	constructor(expression: T, interval: number = 1) {
		this.expression = expression
		this.interval = interval
	}

	public toString(): string {
		return `${this.expression}/${this.interval}`
	}
}
