import {useState, useRef} from 'preact/hooks'
import Router, {route} from 'preact-router'
import ProfileSelection from '@Components/profile-selection'
import GamesSelection from '@Components/games-selection'
import GamePreview from '@Components/game-preview'
import {SteamGame} from '@Types/steam'

const App = () => {
	const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null)
	const lastFilteredSelection = useRef<SteamGame[]>([])
	const handleSpin = (games: SteamGame[]) => {
		lastFilteredSelection.current = games
		setSelectedGame(games[Math.floor(Math.random() * games.length)])
		// ok cuz the order of updates is respected
		route(`/spin`)
	}

	const handleReroll = () => {
		setSelectedGame(
			lastFilteredSelection.current[
				Math.floor(Math.random() * lastFilteredSelection.current.length)
			]
		)
	}

	const handleSelectProfile = (profileUrl: string) => {
		route(`/library/${encodeURIComponent(profileUrl)}`)
	}

	return (
		<div class="bg-red-900 min-h-screen h-full">
			<Router>
				{selectedGame && (
					<GamePreview path="/spin" game={selectedGame} onReroll={handleReroll} />
				)}
				<GamesSelection path="/library/:profileUrl" onSpin={handleSpin} />
				<ProfileSelection onSubmit={handleSelectProfile} default path="/*" />
			</Router>
		</div>
	)
}

export default App
