import { assert } from 'chai'
import { CoinbaseClient, Condition } from "../../src"

/**
 * Test successful client creation.
 * TODO: Beef up these tests later.
 */
assert(Condition.notNull(new CoinbaseClient({
    key: '',
    secret: '',
    passphrase: '',
})))