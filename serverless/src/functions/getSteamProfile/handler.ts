import 'source-map-support/register'

import fetch from 'node-fetch'

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'
import {formatJSONResponse} from '@libs/apiGateway'

const INVALID_PROFILE_URL_ERR = new Error('Invalid profile URL')
const UNAVAILABLE_LIBRARY = new Error(
	"Could not get the profile's library either because the profile is " +
		'private or because the profile has private game details.'
)

const getSteamProfile: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
	const {profileUrl: profileUrlEncoded} = event.queryStringParameters || {}
	const profileUrl = decodeURI(profileUrlEncoded)
	let steamId = profileUrl.match(/(https:\/\/)?steamcommunity.com\/profiles\/(\d+)/)?.[2]

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

		const [
			{
				response: {games},
			},
			{
				response: {
					players: [{personaname, avatarfull}],
				},
			},
		] = await Promise.all([
			fetch(
				`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`
			).then((res) => {
				// Consider everything as client fault because steam API sucks ass and throws 500 on every error

				if (res.status >= 400) throw INVALID_PROFILE_URL_ERR
				return res.json()
			}),
			fetch(
				`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
			).then((res) => {
				if (res.status >= 400) throw INVALID_PROFILE_URL_ERR
				return res.json()
			}),
		])

		if (!games) {
			throw UNAVAILABLE_LIBRARY
		}

		return formatJSONResponse({
			steamProfile: {
				games: games.map(({appid, img_icon_url, name, playtime_forever}) => ({
					appId: appid,
					iconUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`,
					imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`,
					name,
					url: `https://store.steampowered.com/app/${appid}`,
					playTime: playtime_forever,
				})),
				displayName: personaname,
				avatar: avatarfull,
			},
		})
	} catch (e) {
		return formatJSONResponse(
			{message: e.message},
			{
				statusCode: e === INVALID_PROFILE_URL_ERR || e === UNAVAILABLE_LIBRARY ? 400 : 500,
			}
		)
	}
}

export const main = getSteamProfile
