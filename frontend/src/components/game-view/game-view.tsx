import {useQuery} from 'react-query'
import {SteamGame} from '@Types/steam'

type Props = {
	game: SteamGame
}

// TODO properly type the full info
const fetchGameFullInfo = (appId: number) =>
	fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
		.then((res) => res.json())
		.then((data) => {
			if (!(data && data[appId]?.success)) throw new Error("Couldn't fetch game info")
		})

// Todo zjistit jestli jde redirectnout na url která by spustila steam hru přes browser??
// Myslim že ten shit jde přes oficiální stránky but not sure
const GamePreview = ({game}: Props) => {
	/*
	Won't work cuz CORS
	TODO - proxy lambda for full game info
	const {data} = useQuery(['game info', game.appId], () => fetchGameFullInfo(game.appId), {
		staleTime: Infinity,
		retry: false,
	})
	*/

	return (
		<div class="flex flex-col p-8 bg-purple-600 bg-opacity-5 box-content" style={{width: 460}}>
			<div class="relative w-full" style={{height: 215}}>
				<img src={game.imageUrl} class="min-h-24" />
				<div class="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black to-transparent opacity-75" />
				<div class="absolute bottom-0 left-0 p-3">
					<div>64hrs played</div>
					<a href={game.url} target="_blank" rel="noreferrer noopener">
						store link
					</a>
				</div>
			</div>
			<div class="scrollbar mt-4 max-h-48 text-sm overflow-auto">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
				exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
				irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
				deserunt mollit anim id est laborum.
			</div>
		</div>
	)
}

export default GamePreview
