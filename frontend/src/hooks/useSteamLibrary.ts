import {useState} from 'preact/hooks'

export default (profileUrl: string) => {
	const [steamLibrary, setSteamLibrary] = useState([])
	// Maybe create some api wrapper or add react-query + preact/compat
	const fetchSteamLibrary = async () => {
		try {
			const {data, status} = await fetch(
				`http://127.0.0.1:3000/dev/owned-products?profileUrl=${profileUrl}`
			).then((res) => res.json().then((data) => ({status: res.status, data})))

			if (status >= 400) throw new Error(data.message)

			setSteamLibrary(data.games)
		} catch (e) {
			console.error(e)
		}
	}

	return {
		profileUrl,
		fetchSteamLibrary,
		steamLibrary,
	}
}
