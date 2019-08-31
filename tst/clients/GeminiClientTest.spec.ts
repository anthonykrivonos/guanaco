import { assert } from 'chai'
import { GeminiClient, Condition } from "../../src"

/**
 * Test successful client creation.
 * TODO: Beef up these tests later.
 */
assert(Condition.notNull(new GeminiClient({
    key: '',
    sandbox: true,
    secret: '',
})))