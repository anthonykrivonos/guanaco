/**
 * Utility class for checking conditions.
 */
export class Condition {

    /**
     * Check that none of the variadic arguments are null.
     * @param values One or more values to check for nullity.
     */
    public static notNull(...values:any[]) {
        for (let i = 0; i < values.length; i++) {
            if (values[i] == null) {
                return false
            }
        }
        return true
    }

    /**
     * Check that at least one of the values is not null.
     * @param values One or more values to check for nullity.
     */
    public static hasNotNull(...values:any[]) {
        for (let i = 0; i < values.length; i++) {
            if (values[i] != null) {
                return true
            }
        }
        return false
    }

}