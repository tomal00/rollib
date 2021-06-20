import {useState, useEffect, useRef} from 'preact/hooks'
import {route} from 'preact-router'
import {SteamGame, SteamGameApi} from '@Types/steam'

export default (profileUrl: string) => {
	const [steamLibrary, setSteamLibrary] = useState<SteamGame[]>([])
	const promiseRef = useRef<Promise<void | {status: number; data: any}> | null>(null)
	const callbackRef = useRef<Function>()

	useEffect(() => {
		// Would be nice to use react-query instead of doing this hacky shit via refs
		promiseRef.current = fetch(
			`http://127.0.0.1:3000/dev/owned-products?profileUrl=${profileUrl}`
		).then((res) => res.json().then((data) => ({status: res.status, data})))

		callbackRef.current = ({data, status}: {data: any; status: number}) => {
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
		}

		promiseRef.current
			.then(({data, status} = {data: {}, status: 0}) => callbackRef.current({data, status}))
			.catch((e) => {
				route('/')
				alert(e)
			})

		return () => {
			// Set the cb to a blank function so that it doesn't setState when the component is unmounted
			// Doesn't handle the case when the component stays mounted and the profileUrl changes, but the user
			// doesn't have the ability to achieve this at the moment anyway.
			callbackRef.current = () => null
		}
	}, [profileUrl])

	return steamLibrary
}
