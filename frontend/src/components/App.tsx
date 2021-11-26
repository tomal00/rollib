import {useEffect, useState} from 'preact/hooks'
import {FunctionalComponent} from 'preact'
import {useQuery, QueryClient, QueryClientProvider} from 'react-query'
import Button from '@Components/common/button'
import GameView from '@Components/game-view'
import ProfileCard, {ProfileSubmit} from '@Components/profile-card'
import GameStrip from '@Components/game-strip'
import Info from '@Components/info'
import Section, {SectionPosition} from '@Components/section'
import GithubIcon from '@Components/common/github-icon'
import SoundToggle from '@Components/sound-toggle'
import {SteamGame, SteamProfile} from '@Types/steam'
import {soundContext} from '@Utils/sound'
import useLocalStorage from '@Utils/use-local-storage'
import useWindowSize from '@Utils/use-window-size'
import logo from '@Assets/logo.svg'
import {apiUrl} from '@Config'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchIntervalInBackground: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	},
})

const fetchSteamProfile = (profileUrl: string): Promise<SteamProfile> =>
	fetch(`${apiUrl}/steam-profile?profileUrl=${profileUrl}`)
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			if (!data.steamProfile.games.length) {
				throw new Error("There are no games in this steam profile's library.")
			}

			return data.steamProfile
		})

type AppProps = {
	setProfileUrl: (profileUrl: string) => void
	steamProfile?: SteamProfile
	isLoading: boolean
}

function MobileApp({setProfileUrl, steamProfile, isLoading}: AppProps): JSX.Element {
	const [gameView, setGameView] = useState<null | SteamGame>(null)

	useEffect(() => {
		if (steamProfile) {
			setGameView(steamProfile.games[Math.floor(Math.random() * steamProfile.games.length)])
		}
	}, [steamProfile])

	return (
		<>
			<div class='pt-1 text-center text-sm'>
				You are using the mobile version (the one which sucks)
			</div>
			<Section position={gameView ? SectionPosition.LEFT : SectionPosition.CENTER}>
				<div class='h-144 flex flex-col items-center'>
					<ProfileSubmit isLoading={isLoading} onSubmit={setProfileUrl} />
					{!gameView && <Info />}
				</div>
			</Section>
			<Section position={gameView ? SectionPosition.CENTER : SectionPosition.RIGHT}>
				{steamProfile && gameView && (
					<>
						<img src={gameView.imageUrl} />
						<p>{gameView.name}</p>
						<Button
							onClick={() =>
								setGameView(
									steamProfile.games[
										Math.floor(Math.random() * steamProfile.games.length)
									]
								)
							}>
							Re-roll
						</Button>
					</>
				)}
			</Section>
		</>
	)
}

function DesktopApp({setProfileUrl, steamProfile, isLoading}: AppProps): JSX.Element {
	const [gameView, setGameView] = useState<null | SteamGame>(null)
	const [gameViewActive, setGameViewActive] = useState(false)
	const soundState = useLocalStorage('soundEnabled', true)

	return (
		<soundContext.Provider value={soundState}>
			<Section position={gameViewActive ? SectionPosition.LEFT : SectionPosition.CENTER}>
				<div class='h-144 flex flex-col items-center'>
					<ProfileCard
						isLoading={isLoading}
						steamProfile={steamProfile}
						setProfileUrl={setProfileUrl}
					/>
					{steamProfile ? (
						<GameStrip
							games={steamProfile?.games || []}
							setGameView={setGameView}
							onRollEnd={() => setGameViewActive(true)}
						/>
					) : (
						<Info />
					)}
				</div>
				<SoundToggle />
			</Section>
			<Section position={gameViewActive ? SectionPosition.CENTER : SectionPosition.RIGHT}>
				{gameView && <GameView game={gameView} isVisible={gameViewActive} />}
				<Button
					onClick={() => setGameViewActive(false)}
					class='absolute left-6 top-6 text-gray-300 hover:text-purple-500 underline text-3xl'
					colorClassNames='bg-auto'>
					← Re-roll
				</Button>
			</Section>
			<div class='fixed bottom-0 left-0 flex items-end justify-between p-4 w-full'>
				<img src={logo} class='h-8' />
				<a
					target='_blank'
					rel='noopener'
					href='https://github.com/tomal00/rollib'
					class='text-purple-300 hover:text-purple-500 cursor-pointer transition-colors'>
					<GithubIcon color='inherit' height='32' width='32' />
				</a>
			</div>
		</soundContext.Provider>
	)
}

function App(): JSX.Element {
	const [profileUrl, setProfileUrl] = useState('')
	const {width} = useWindowSize()
	const {data: steamProfile, isLoading} = useQuery(
		profileUrl,
		() => fetchSteamProfile(profileUrl),
		{
			staleTime: Infinity,
			cacheTime: Infinity,
			retry: false,
			enabled: !!profileUrl,
			onError: (e) => {
				setProfileUrl('')
				alert(e)
			},
		}
	)

	const App = width < 640 ? MobileApp : DesktopApp

	return <App isLoading={isLoading} steamProfile={steamProfile} setProfileUrl={setProfileUrl} />
}

const WithQueryClient = (Component: FunctionalComponent) => (props: any) =>
	(
		<QueryClientProvider client={queryClient}>
			<Component {...props} />
		</QueryClientProvider>
	)

export default WithQueryClient(App)
