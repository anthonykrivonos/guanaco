/**
 * A simple extension of Date that allows users to test starting their day of choice.
 */
export class BacktestDate extends Date {
	/**
	 * Get the current date as a BacktestDate.
	 */
	public static today() {
		return new Date()
	}

	constructor(day?: number, month?: number, year?: number, hour?: number, minute?: number) {
		super()
		if (day) {
			this.setDate(day)
		}
		if (month) {
			this.setMonth(month)
		}
		if (year) {
			this.setFullYear(year)
		}
		this.setHours(hour || this.getHours(), minute)
	}
}
