import {useState, useRef} from 'preact/hooks'
import Router, {route} from 'preact-router'
import {QueryClient, QueryClientProvider} from 'react-query'
import ProfileSelection from '@Components/profile-selection'
import GamesSelection from '@Components/games-selection'
import GamePreview from '@Components/game-preview'
import {SteamGame} from '@Types/steam'

const queryClient = new QueryClient()

const App = () => {
	const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null)
	const lastFilteredSelection = useRef<SteamGame[]>([])
	const handleSpin = (games: SteamGame[]) => {
		lastFilteredSelection.current = games
		setSelectedGame(games[Math.floor(Math.random() * games.length)])
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
		<QueryClientProvider client={queryClient}>
			<div class="bg-gray-700 min-h-screen h-full">
				<Router>
					{selectedGame && (
						<GamePreview path="/spin" game={selectedGame} onReroll={handleReroll} />
					)}
					<GamesSelection path="/library/:profileUrl" onSpin={handleSpin} />
					<ProfileSelection onSubmit={handleSelectProfile} default path="/*" />
				</Router>
			</div>
		</QueryClientProvider>
	)
}

export default App
