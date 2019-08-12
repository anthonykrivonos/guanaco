import { OrderId } from './OrderId'

export enum OrderStatus {
	SUCCESS,

	/**
	 * Returned when the client has failed during order placement.
	 */
	CLIENT_FAILURE,

	/**
	 * Returned when the user is not authorized to place an order.
	 */
	UNAUTHORIZED_FAILURE,
}

export interface OrderResponse {
	/**
	 * Optional ID of the order.
	 */
	id?: OrderId

	/**
	 * Status of the response.
	 */
	status: OrderStatus

	/**
	 * Message taken from the response.
	 */
	message?: string
}
