import {useQuery} from 'react-query'
import {useLayoutEffect, useState, useRef, useEffect} from 'preact/hooks'
import {FunctionalComponent} from 'preact'
import {QueryClient, QueryClientProvider} from 'react-query'
import classnames from 'classnames'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import {SteamGame, SteamProfile, StoreAsset, StoreInfo} from '@Types/steam'
import randomSubarray from '@Utils/randomSubarray'
import minsToPlaytime from '@Utils/minsToPlaytime'
import defaultAvatar from '@Assets/default-avatar.png'
import steamLogo from '@Assets/steam-logo.svg'
import playIcon from '@Assets/play.svg'

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

const fetchGameStoreInfo = (appId: number): Promise<StoreInfo> =>
	fetch(`http://localhost:3000/dev/store-info?appId=${appId}`, {cache: 'force-cache'})
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			return data
		})

const GameView = ({game, autoPlay}: {game: SteamGame; autoPlay: boolean}) => {
	const [activePreview, setActivePreview] = useState<StoreAsset | null>(null)
	const activeVideoRef = useRef<HTMLVideoElement>()
	const {data: storeInfo, isError} = useQuery(
		`store-info-${game.appId}`,
		() => fetchGameStoreInfo(game.appId),
		{
			staleTime: Infinity,
			cacheTime: Infinity,
			retry: false,
			onSuccess: ({images, videos}) => {
				setActivePreview(videos[0] || images[0])
			},
		}
	)
	const lastShowcaseItemIndex =
		(storeInfo?.videos.length || 0) + (storeInfo?.images.length || 0) - 1
	const hasImages = !!storeInfo?.images.length
	const isPreviewVideo = storeInfo?.videos.includes(activePreview as StoreAsset)
	const previewProps = {style: {height: 331, width: 589}, height: 331, width: 589} // damn you tailwind

	useEffect(() => {
		if (autoPlay) {
			setTimeout(() => activeVideoRef.current?.play(), 750)
		} else {
			activeVideoRef.current?.pause()
		}
	}, [autoPlay])

	useLayoutEffect(() => {
		if (isPreviewVideo && autoPlay) {
			activeVideoRef.current.play()
		}
		// DO NOT INCLUDE autoPlay in deps
		// This hook should handle ONLY switching between videos = we don't care if autoPlay changes.
		// We only care whether or not it's enabled when activePreview changes
	}, [activePreview, isPreviewVideo])

	if (isError) {
		return (
			<div>
				<div class="text-3xl">{game.name}</div>
				<img class="mb-6 mt-6 w-auto h-auto" src={game.imageUrl} />
				<div class="w-96">
					Unfortunately this product seems not to be available in the steam store at this
					moment and so it's not possible to display any further info
				</div>
			</div>
		)
	}

	return (
		<div class="grid gap-6 grid-cols-6 max-w-4xl auto-rows-auto">
			<div class="col-span-6 text-3xl">{game.name}</div>
			{isPreviewVideo ? (
				<video
					ref={activeVideoRef}
					key={activePreview?.id}
					class="col-span-4 row-span-4"
					controls
					playsInline
					muted
					{...previewProps}>
					<source src={activePreview?.url} type="video/webm" />
				</video>
			) : (
				<img {...previewProps} class="col-span-4 row-span-4" src={activePreview?.url} />
			)}
			<div class="flex flex-col col-span-2 row-span-4">
				<img class="mb-6" src={game.imageUrl} />
				<p
					class="line-clamp-5 mb-6 text-sm"
					dangerouslySetInnerHTML={{__html: storeInfo?.description || ''}}
				/>
				<p class="mb-1 mt-auto">
					<b>
						{game.playTime
							? `${minsToPlaytime(game.playTime)} on record`
							: 'You have never played this game'}
					</b>
				</p>
				<p>
					<a
						rel="noreferrer noopener"
						target="_blank"
						href={`https://store.steampowered.com/app/${game.appId}`}
						class="hover:text-purple-400 underline transition-colors">
						<img class="inline mr-1 h-6" src={steamLogo} />
						Steam store link
					</a>
				</p>
			</div>
			<div class="scrollbar col-span-6 pb-2 whitespace-nowrap select-none overflow-x-auto">
				{storeInfo?.videos.map((video, i) => (
					<div
						key={video.id}
						onClick={() => setActivePreview(video)}
						class={classnames(
							'relative inline-block cursor-pointer transition-opacity',
							(i > 0 || hasImages) && i < lastShowcaseItemIndex && 'mr-2',
							video !== activePreview && 'opacity-30 hover:opacity-70'
						)}>
						<img class="inline h-16" src={video.thumbnail} />
						<img
							class="absolute left-1/2 top-1/2 h-6 transform -translate-x-1/2 -translate-y-1/2"
							src={playIcon}
						/>
					</div>
				))}
				{storeInfo?.images.map((image, i) => (
					<img
						key={image.id}
						onClick={() => setActivePreview(image)}
						src={image.thumbnail}
						class={classnames(
							'inline h-16 cursor-pointer transition-opacity',
							i < lastShowcaseItemIndex && 'mr-2',
							image !== activePreview && 'opacity-30 hover:opacity-70'
						)}
					/>
				))}
			</div>
		</div>
	)
}

const App = () => {
	const [profileUrl, setProfileUrl] = useState('')
	const [gameView, setGameView] = useState<null | SteamGame>(null)
	const [gameViewActive, setGameViewActive] = useState(false)
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
			<>
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
				{
					<Games
						games={games}
						setGameView={setGameView}
						onRollEnd={() => setGameViewActive(true)}
					/>
				}
			</>
		)
	}

	return (
		<div class="relative h-full min-h-screen bg-gray-700 overflow-hidden">
			<div
				class={classnames(
					'h-96 translate flex flex-col items-center justify-center min-h-screen transform transition-transform',
					gameViewActive && '-translate-x-full'
				)}
				style={{
					transitionDuration: 500,
				}}>
				{renderSpinner()}
			</div>
			<div
				class={classnames(
					'absolute top-0 w-full flex flex-col items-center justify-center h-full transform transition-transform',
					!gameViewActive && 'translate-x-full'
				)}
				style={{transitionDuration: 500}}>
				{gameView && <GameView game={gameView} autoPlay={gameViewActive} />}
				<Button
					onClick={() => setGameViewActive(false)}
					class="absolute left-6 top-6 text-gray-300 hover:text-purple-500 underline text-3xl"
					colorClassNames="bg-auto">
					← Re-roll
				</Button>
			</div>
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

const Games = ({
	games,
	onRollEnd,
	setGameView,
}: {
	games: SteamGame[]
	setGameView: (game: SteamGame) => void
	onRollEnd: () => void
}) => {
	const [visibleGames, setVisibleGames] = useState<SteamGame[]>([])
	const [isRolling, setIsRolling] = useState(false)

	const handleRoll = () => {
		setIsRolling(true)
		setGameView(visibleGames[62])
		setTimeout(() => {
			setVisibleGames([...visibleGames.slice(-5), ...mapKeys(randomSubarray(games, 60))])
			setIsRolling(false)
			onRollEnd()
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
