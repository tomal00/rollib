import {useState} from 'preact/hooks'
import ProfileSelection from './ProfileSelection'
import useSteamLibrary from '../hooks/useSteamLibrary'

const App = () => {
	const [profileUrl, setProfileUrl] = useState('')
	const {fetchSteamLibrary, steamLibrary} = useSteamLibrary(profileUrl)

	return (
		<div class="bg-gray-50 h-screen">
			<ProfileSelection
				onSubmit={fetchSteamLibrary}
				profileUrl={profileUrl}
				setProfileUrl={setProfileUrl}
			/>
		</div>
	)
}

export default App
