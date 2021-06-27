import {useQuery} from 'react-query'
import {SteamGame} from '@Types/steam'
import Button from '@Components/common/button'

type Props = {
	game: SteamGame
	onReroll: () => void
	path: string
}

// TODO properly type the full info
const fetchGameFullInfo = (appId: number) =>
	fetch(`https://store.steampowered.com/api/appdetails?appids=722290${appId}`)
		.then((res) => res.json())
		.then((data) => {
			if (!(data && data[appId]?.success)) throw new Error("Couldn't fetch game info")
		})

// Todo zjistit jestli jde redirectnout na url která by spustila steam hru přes browser??
// Myslim že ten shit jde přes oficiální stránky but not sure
const GamePreview = ({game, onReroll}: Props) => {
	/*
	Won't work cuz CORS
	TODO - proxy lambda for full game info
	const {data} = useQuery(['game info', game.appId], () => fetchGameFullInfo(game.appId), {
		staleTime: Infinity,
		retry: false,
	})
	*/

	return (
		<div class="min-h-screen h-full flex flex-col justify-center items-center">
			<div class="p-4 bg-red-700 rounded">
				<a class="block" href={game.url} target="_blank" rel="noreferrer noopener">
					<img class="rounded m-auto" src={game.imageUrl} />
				</a>
				<div class="text-2xl text-center mt-4">{game.name}</div>
			</div>
			<Button class="mt-2" onClick={onReroll}>
				Reroll
			</Button>
		</div>
	)
}

export default GamePreview
