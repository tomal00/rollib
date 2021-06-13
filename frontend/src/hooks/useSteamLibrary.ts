import {useState} from 'preact/hooks'
import {SteamGame, SteamGameApi} from '@Types/steam'

export default (profileUrl: string) => {
	const [steamLibrary, setSteamLibrary] = useState<SteamGame[] | null>(null)
	// Maybe create some api wrapper or add react-query + preact/compat
	const fetchSteamLibrary = async () => {
		try {
			const {data, status} = await fetch(
				`http://127.0.0.1:3000/dev/owned-products?profileUrl=${profileUrl}`
			).then((res) => res.json().then((data) => ({status: res.status, data})))

			if (status >= 400) throw new Error(data.message)

			setSteamLibrary(
				data.games.map(({appid, img_icon_url, name}: SteamGameApi) => ({
					appId: appid,
					iconUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`,
					imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`,
					name,
					url: `https://store.steampowered.com/app/${appid}`,
				}))
			)
		} catch (e) {
			alert(e)
		}
	}

	return {
		profileUrl,
		fetchSteamLibrary,
		steamLibrary,
	}
}
