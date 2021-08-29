import {useQuery} from 'react-query'
import {useLayoutEffect, useState} from 'preact/hooks'
import {FunctionalComponent} from 'preact'
import {QueryClient, QueryClientProvider} from 'react-query'
import classnames from 'classnames'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import {SteamGame, SteamProfile} from '@Types/steam'
import randomSubarray from '@Utils/randomSubarray'
import defaultAvatar from '@Assets/default-avatar.png'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchIntervalInBackground: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	},
})

// TODO - preload all game logos
const fetchSteamProfile = (profileUrl: string): Promise<SteamProfile> =>
	fetch(`http://127.0.0.1:3000/dev/steam-profile?profileUrl=${profileUrl}`)
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			return data.steamProfile
		})

const App = () => {
	const [profileUrl, setProfileUrl] = useState('')
	const [gameView, setGameView] = useState<null | SteamGame>(null)
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
	const games = steamProfile?.games || []

	// TODO make this a component
	const renderSpinner = () => {
		return (
			<div
				class={classnames(
					'h-96 translate flex flex-col items-center justify-center min-h-screen transform transition-transform',
					gameView && '-translate-x-full'
				)}
				style={{
					transitionDuration: 500,
				}}>
				<div class="grid gap-2 gap-x-4 grid-cols-3 grid-rows-3 p-6 w-max bg-purple-600 bg-opacity-5">
					<img
						class={classnames('row-span-2 h-32', !steamProfile && 'opacity-30')}
						src={steamProfile?.avatar || defaultAvatar}
					/>
					<div
						style={{maxWidth: 256}}
						class={classnames(
							'col-span-2 text-2xl truncate',
							!steamProfile && 'opacity-30'
						)}>
						{steamProfile?.displayName || 'Load steam library'}
					</div>
					<div
						style={{maxWidth: 256}}
						class={classnames('col-span-2 text-base', !steamProfile && 'opacity-30')}>
						{steamProfile?.games.length
							? `${steamProfile.games.length} games owned`
							: 'Load a steam profile'}
					</div>
					<ProfileUrlSubmit onSubmit={setProfileUrl} />
				</div>
				{<Games games={games} onRollEnd={setGameView} />}
			</div>
		)
	}

	// TODO make this a component
	const renderGameView = () => {
		return (
			<div
				onClick={() => setGameView(null)}
				class={classnames(
					'absolute top-0 w-full transform transition-transform',
					!gameView && 'translate-x-full'
				)}
				style={{transitionDuration: 500}}>
				TADY JE sekce jak vino
			</div>
		)
	}

	return (
		<div class="relative h-full min-h-screen bg-gray-700 overflow-hidden">
			{renderSpinner()}
			{renderGameView()}
		</div>
	)
}

// hack so that keys are unique and keys of visible items stay the same between renders to keep them mounted
let acc = 0
const mapKeys = (games: SteamGame[]): SteamGame[] => {
	for (let i = 0; i < games.length; i++) {
		games[i] = {...games[i], key: String(acc)}
		acc++
	}
	return games
}

const Games = ({games, onRollEnd}: {games: SteamGame[]; onRollEnd: (game: SteamGame) => void}) => {
	const [visibleGames, setVisibleGames] = useState<SteamGame[]>([])
	const [isRolling, setIsRolling] = useState(false)

	const handleRoll = () => {
		setIsRolling(true)
		setTimeout(() => {
			setVisibleGames([...visibleGames.slice(-5), ...mapKeys(randomSubarray(games, 60))])
			setIsRolling(false)
			onRollEnd(visibleGames[62])
		}, 5100)
	}

	useLayoutEffect(() => {
		if (games.length) {
			setVisibleGames(mapKeys(randomSubarray(games, 65)))
		}
	}, [!!games.length])

	// TODO - some filters e.g. never played only
	return (
		<>
			<div
				style={{width: 4 * 240, minHeight: 112}}
				class={classnames(
					'relative mt-24 overflow-hidden transition-opacity',
					visibleGames.length ? 'opacity-100' : 'opacity-0'
				)}>
				<div
					class={classnames('flex', isRolling && 'games-rolling-animation')}
					style={{
						transform: 'translateX(calc(-0.5 * 240px)',
					}}>
					{visibleGames.map((game) => (
						<img
							key={game.key}
							class="object-cover"
							src={game.imageUrl}
							alt={game.name}
							style={{
								width: 240,
								minWidth: 240,
								height: 112,
							}}
						/>
					))}
				</div>
				<div
					class="absolute top-0 h-full border-2 border-purple-700"
					style={{left: '50%', transform: 'translateX(-50%)', width: 240}}></div>
				<div class="absolute top-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-700 via-transparent" />
			</div>
			<div
				class={classnames(
					'transition-opacity',
					visibleGames.length ? 'opacity-100' : 'opacity-0'
				)}>
				<Button
					onClick={handleRoll}
					disabled={isRolling || !visibleGames.length}
					class="mt-4 w-24">
					Roll
				</Button>
			</div>
		</>
	)
}

const ProfileUrlSubmit = ({onSubmit}: {onSubmit: (profuleUrl: string) => void}) => {
	const [value, setValue] = useState<string>('')

	return (
		<>
			<TextInput
				label="Profile URL"
				placeholder="steamcommunity.com/id/sample"
				inputClass="min-w-0"
				type="text"
				class="col-span-2 self-center"
				onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
					setValue(e.currentTarget.value)
				}
				value={value}
			/>
			<Button
				// Maybe add some proper validation
				disabled={!value}
				onClick={() => onSubmit(value)}
				class="self-center place-self-center mt-4 w-24">
				Load
			</Button>
		</>
	)
}

const WithQueryClient = (Component: FunctionalComponent) => (props: any) =>
	(
		<QueryClientProvider client={queryClient} r>
			<Component {...props} />
		</QueryClientProvider>
	)

export default WithQueryClient(App)
