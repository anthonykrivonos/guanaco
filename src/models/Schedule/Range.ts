/**
 * Class that permits range representation.
 */
export class Range<T> {
	private lowerBound: T
	private upperBound: T

	constructor(lowerBound: T, upperBound: T) {
		this.lowerBound = lowerBound
		this.upperBound = upperBound
	}

	public toString(): string {
		return `${this.lowerBound}-${this.upperBound}`
	}
}
