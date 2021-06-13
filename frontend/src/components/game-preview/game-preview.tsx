import {SteamGame} from '@Types/steam'
import Button from '@Components/common/button'

type Props = {
	game: SteamGame
	onReroll: () => void
}

// Todo zjistit jestli jde redirectnout na url která by spustila steam hru přes browser??
// Myslim že ten shit jde přes oficiální stránky but not sure
const GamePreview = ({game, onReroll}: Props) => {
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
