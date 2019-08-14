import { assert } from 'chai'
import { CoinbaseClient } from "../../src"

/**
 * Test successful client creation.
 * TODO: Beef up these tests later.
 */
assert(new CoinbaseClient({
    key: '',
    secret: '',
    passphrase: '',
}) != null)