/**
 * Utility class for checking conditions.
 */
export class Condition {
	/**
	 * Check that all of the variadic arguments are null.
	 * @param values One or more values to check for nullity.
	 */
	public static null(...values: any[]) {
		for (const value of values) {
			if (value !== null && value !== undefined) {
				return false
			}
		}
		return true
	}

	/**
	 * Check that none of the variadic arguments are null.
	 * @param values One or more values to check for non-nullity.
	 */
	public static notNull(...values: any[]) {
		for (const value of values) {
			if (value === null || value === undefined) {
				return false
			}
		}
		return true
	}

	/**
	 * Check that at least one of the values is not null.
	 * @param values One or more values to check for nullity.
	 */
	public static hasNotNull(...values: any[]) {
		for (const value of values) {
			if (value !== null && value !== undefined) {
				return true
			}
		}
		return false
	}
}
