import { BacktestClient } from '../clients'

/**
 * A function that passes in a backtesting client.
 */
export type BacktestFunction = (client: BacktestClient) => void
