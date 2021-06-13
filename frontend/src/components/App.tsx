import {useState} from 'preact/hooks'
import ProfileSelection from '@Components/profile-selection'
import GamesSelection from '@Components/games-selection'
import GamePreview from '@Components/game-preview'
import useSteamLibrary from '@Hooks/useSteamLibrary'
import {SteamGame} from '@Types/steam'

const App = () => {
	const [profileUrl, setProfileUrl] = useState('')
	const {fetchSteamLibrary, steamLibrary} = useSteamLibrary(profileUrl)
	const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null)
	// mby keep the state here and control GamesSelection???
	const [lastFilteredSelection, setLastFilteredSelection] = useState<SteamGame[]>([])

	const handleSpin = (games: SteamGame[]) => {
		// double render :/
		setLastFilteredSelection(games)
		setSelectedGame(games[Math.floor(Math.random() * games.length)])
	}

	const handleReroll = () => {
		setSelectedGame(
			lastFilteredSelection[Math.floor(Math.random() * lastFilteredSelection.length)]
		)
	}

	return (
		<div class="bg-red-900 min-h-screen h-full">
			{selectedGame ? (
				<GamePreview game={selectedGame} onReroll={handleReroll} />
			) : steamLibrary ? (
				<GamesSelection steamLibrary={steamLibrary} onSpin={handleSpin} />
			) : (
				<ProfileSelection
					onSubmit={fetchSteamLibrary}
					profileUrl={profileUrl}
					setProfileUrl={setProfileUrl}
				/>
			)}
		</div>
	)
}

export default App
