import 'source-map-support/register'

import fetch from 'node-fetch'

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'
import {formatJSONResponse} from '@libs/apiGateway'

const INVALID_PROFILE_URL_ERR = new Error('Invalid profile URL')

const getOwnedProducts: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
	const {queryStringParameters: {profileUrl: profileUrlEncoded} = {}} = event
	const profileUrl = decodeURI(profileUrlEncoded)
	let steamId = profileUrl.match(/https:\/\/steamcommunity.com\/profiles\/(\d+)/)?.[1]

	try {
		// handle vanity urlName
		if (!steamId) {
			const urlName = profileUrl.match(/id\/([a-zA-Z0-9_]+)/)?.[1]

			if (!urlName) {
				throw INVALID_PROFILE_URL_ERR
			}

			const {response} = await fetch(
				`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${urlName}`
			).then((res) => res.json())

			steamId = response.steamid
		}

		if (!steamId) {
			throw INVALID_PROFILE_URL_ERR
		}

		const {
			response: {games},
		} = await fetch(
			`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`
		).then((res) => {
			// Consider everything as client fault because steam API sucks ass and throws 500 on every error
			if (res.status >= 400) throw INVALID_PROFILE_URL_ERR
			return res.json()
		})

		return formatJSONResponse({
			games,
			event,
		})
	} catch (e) {
		return formatJSONResponse({message: e.message}, e === INVALID_PROFILE_URL_ERR ? 400 : 500)
	}
}

export const main = getOwnedProducts
