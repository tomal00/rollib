import type {APIGatewayProxyHandler} from 'aws-lambda'
import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'

export const parseBodyMiddleware = (
	handler: ValidatedEventAPIGatewayProxyEvent<any>
): APIGatewayProxyHandler => (event, ...args) => {
	const eventWithBody = {...event, body: JSON.parse(event.body)}

	return handler(eventWithBody, ...args)
}
