import { assert } from 'chai'
import { GeminiClient } from "../../src"

/**
 * Test successful client creation.
 * TODO: Beef up these tests later.
 */
assert(new GeminiClient({
    key: '',
    sandbox: true,
    secret: '',
}) != null)