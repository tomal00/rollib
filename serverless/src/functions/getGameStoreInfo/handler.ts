import 'source-map-support/register'

import fetch from 'node-fetch'
import * as sanitizeHtml from 'sanitize-html'

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'
import {formatJSONResponse} from '@libs/apiGateway'

const INVALID_APP_ID_ERR = new Error('Invalid appId')
const UNKNOWN_ERROR = new Error('Unknown error')

const getGameStoreInfo: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
	const {appId} = event.queryStringParameters || {}

	try {
		if (!appId.match(/^\d+$/g)) {
			throw INVALID_APP_ID_ERR
		}

		let {[appId]: gameInfo} = await fetch(
			`https://store.steampowered.com/api/appdetails?appids=${appId}`
		).then((res) => res.json())

		if (gameInfo.data?.fullgame) {
			const fullGameAppId = String(gameInfo.data.fullgame.appid)
			const fullGameRes = await fetch(
				`https://store.steampowered.com/api/appdetails?appids=${fullGameAppId}`
			).then((res) => res.json())
			gameInfo = fullGameRes[fullGameAppId]
		}

		if (!gameInfo.success) {
			throw UNKNOWN_ERROR
		}

		const {short_description: description, screenshots, movies} = gameInfo.data

		const images =
			screenshots?.map(({id, path_full, path_thumbnail}) => ({
				id,
				url: path_full,
				thumbnail: path_thumbnail,
				type: 'image',
			})) || []
		const videos =
			movies?.map(({id, thumbnail, webm}) => ({
				id,
				thumbnail,
				url: webm['480'].replace('http://', 'https://'),
				type: 'video',
			})) || []

		return formatJSONResponse({
			description: sanitizeHtml(description, {allowedTags: [], allowedAttributes: {}}),
			assets: videos.concat(images),
		})
	} catch (e) {
		return formatJSONResponse(
			{message: e.message},
			{
				statusCode: e === INVALID_APP_ID_ERR ? 400 : 500,
			}
		)
	}
}

export const main = getGameStoreInfo
