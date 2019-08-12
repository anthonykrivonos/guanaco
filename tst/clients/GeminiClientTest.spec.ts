import { GeminiClient, Interval, SymbolInfo } from "../../src"
import { Scheduler } from '../../src/scheduler'
import { assert } from 'chai'

/**
 * Test successful client creation.
 * TODO: Beef up these tests later.
 */
assert(new GeminiClient({
    key: '',
    sandbox: true,
    secret: '',
}) != null)