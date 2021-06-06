import {useState} from 'preact/hooks'
import ProfileSelection from '@Components/profile-selection'
import GamesSelection from '@Components/games-selection'
import useSteamLibrary from '@Hooks/useSteamLibrary'

const App = () => {
	const [profileUrl, setProfileUrl] = useState('')
	const {fetchSteamLibrary, steamLibrary} = useSteamLibrary(profileUrl)

	return (
		<div class="bg-red-900 min-h-screen h-full">
			{steamLibrary ? (
				<GamesSelection steamLibrary={steamLibrary} />
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
