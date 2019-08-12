export class Converter {
	/**
	 * Safely converts a numerical value to a string.
	 * @param num Any number.
	 * @returns The number as a string.
	 */
	public static numToStr(num: number): string {
		return num.toString()
	}

	/**
	 * Safely converts a string to a number, flooring at another number.
	 * @param price Any string
	 * @returns The string as a number.
	 */
	public static strToNum(str: string, floor: number = 0): number {
		const strNum = parseFloat(str)
		return Math.max(floor, strNum)
	}
}
