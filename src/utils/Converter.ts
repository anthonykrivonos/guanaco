import { Symbol } from "../models";

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

	/**
	 * Converts the symbol enum to a digestible Coinbase product.
	 * @param symbol The symbol to convert.
	 */
	public static symbolToProduct(symbol:Symbol): string {
		return `${symbol.substr(0, 3)}-${symbol.substr(3, 3)}`.toUpperCase()
	}

	/**
	 * Converts the symbol enum to an array of exchange products [fromCurrency, toCurrency]
	 * @param symbol The symbol to convert.
	 */
	public static symbolToProducts(symbol:Symbol): string[] {
		return [symbol.substr(0, 3).toUpperCase(), symbol.substr(3, 3).toUpperCase()]
	}

	/**
	 * Converts the digestible Coinbase product to a symbol enum.
	 * @param product The product to convert.
	 */
	public static productToSymbol(product:string): Symbol {
		return product.replace('-', '').toLowerCase() as Symbol
	}

}
