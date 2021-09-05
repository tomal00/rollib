import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from 'aws-lambda'
import type {FromSchema} from 'json-schema-to-ts'

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
	body: FromSchema<S>
}
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
	ValidatedAPIGatewayProxyEvent<S>,
	APIGatewayProxyResult
>

// TODO - CORS
export const formatJSONResponse = (
	response: Record<string, unknown>,
	opts?: {
		statusCode?: number
		headers?: {[header: string]: string | number | boolean}
	}
) => {
	return {
		statusCode: opts?.statusCode || 200,
		body: JSON.stringify(response),
		headers: opts?.headers,
	}
}
