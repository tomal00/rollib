import {useQuery} from 'react-query'
import {useLayoutEffect, useState, useRef, useEffect, useMemo, useCallback} from 'preact/hooks'
import {FunctionalComponent, ComponentChildren} from 'preact'
import {QueryClient, QueryClientProvider} from 'react-query'
import debounce from 'lodash/debounce'
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

const fetchSteamProfile = (profileUrl: string): Promise<SteamProfile> =>
	fetch(`http://127.0.0.1:3000/dev/steam-profile?profileUrl=${profileUrl}`)
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			if (!data.steamProfile.games.length) {
				throw new Error("There are no games in this steam profile's library.")
			}

			return data.steamProfile
		})

const fetchGameStoreInfo = (appId: number): Promise<StoreInfo> =>
	fetch(`http://localhost:3000/dev/store-info?appId=${appId}`, {cache: 'force-cache'})
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			return data
		})

const GameView = ({game, isVisible}: {game: SteamGame; isVisible: boolean}) => {
	const [activePreview, setActivePreview] = useState<StoreAsset | null>(null)
	const activeVideoRef = useRef<HTMLVideoElement>()
	const {data: {assets = [], description = ''} = {}, isError} = useQuery(
		`store-info-${game.appId}`,
		() => fetchGameStoreInfo(game.appId),
		{
			staleTime: Infinity,
			cacheTime: Infinity,
			retry: false,
			onSuccess: ({assets = [null]}) => {
				setActivePreview(assets[0])
			},
		}
	)
	const previewProps = {style: {height: 331, width: 589}, height: 331, width: 589} // damn you tailwind
	useEffect(() => {
		if (isVisible) {
			setTimeout(() => activeVideoRef.current?.play(), 750)
		} else {
			activeVideoRef.current?.pause()
		}
	}, [isVisible])

	useLayoutEffect(() => {
		if (activePreview?.type === 'video' && isVisible) {
			activeVideoRef.current.play()
		}
	}, [activePreview])

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
			{activePreview?.type === 'video' ? (
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
				<img class="mb-3" src={game.imageUrl} />
				<p
					class="line-clamp-6 mb-3 text-sm"
					// Special characters :/ - sanitized by BE just in case
					dangerouslySetInnerHTML={{__html: description}}
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
			<div class="scrollbar col-span-6 pb-2 whitespace-nowrap select-none overflow-x-auto space-x-2">
				{assets.map((asset) =>
					asset.type === 'video' ? (
						<div
							key={asset.id}
							onClick={() => setActivePreview(asset)}
							class={classnames(
								'relative inline-block cursor-pointer transition-opacity',
								asset !== activePreview && 'opacity-30 hover:opacity-70'
							)}>
							<img class="inline h-16" src={asset.thumbnail} />
							<img
								class="absolute left-1/2 top-1/2 h-6 transform -translate-x-1/2 -translate-y-1/2"
								src={playIcon}
							/>
						</div>
					) : (
						<img
							key={asset.id}
							onClick={() => setActivePreview(asset)}
							src={asset.thumbnail}
							class={classnames(
								'inline h-16 cursor-pointer transition-opacity',
								asset !== activePreview && 'opacity-30 hover:opacity-70'
							)}
						/>
					)
				)}
			</div>
		</div>
	)
}

enum PlaytimeFilter {
	ALL = 'ALL',
	UNPLAYED_ONLY = 'UNPLAYED_ONLY',
}

type PlaytimeFilterT = PlaytimeFilter | number

const Filter = ({
	selectedFilter,
	setSelectedFilter,
}: {
	selectedFilter: PlaytimeFilterT
	setSelectedFilter: (filter: PlaytimeFilterT) => void
}) => {
	const [maxHours, setMaxHours] = useState(0)
	const setSelectedFilterDebounced = useCallback(debounce(setSelectedFilter, 300), [
		setSelectedFilter,
	])
	const renderOption = (value: PlaytimeFilterT, node: ComponentChildren | string) => {
		const isSelected =
			value === selectedFilter ||
			(typeof value === 'number' && typeof selectedFilter === 'number')
		return (
			<div
				onClick={() => setSelectedFilter(value)}
				class={classnames(
					'p-1 cursor-pointer border-b-2 border-transparent transition-colors',
					isSelected
						? ' border-purple-700 text-white'
						: 'hover:border-purple-500 text-gray-400'
				)}>
				{node}
			</div>
		)
	}

	return (
		<div class="flex items-end select-none space-x-8">
			{/* TODO - decringify this later */}
			{renderOption(PlaytimeFilter.ALL, 'All games')}
			{renderOption(PlaytimeFilter.UNPLAYED_ONLY, 'Unplayed only')}
			{renderOption(
				maxHours,
				<>
					<label for="max-hours" class="text-inherit block text-xs">
						Max hours
					</label>
					<input
						id="max-hours"
						class="w-20 text-current bg-transparent"
						min={0}
						max={9999}
						type="number"
						value={maxHours}
						onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
							const val = Math.abs(Number(e.currentTarget.value))
							setMaxHours(val)
							setSelectedFilterDebounced(val)
						}}
					/>
				</>
			)}
		</div>
	)
}

// TODO - Add some info when no profile is loaded like https://thewheelhaus.com/
// TODO - Might be nice to show link to https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276
// when private profile is detected

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

	// TODO make this a component
	const renderSpinner = () => {
		return (
			<div class="h-144 flex flex-col items-center">
				<div class="grid gap-2 gap-x-4 grid-cols-3 grid-rows-3 p-6 w-max bg-purple-600 bg-opacity-5">
					<img
						class={classnames(
							'row-span-2 h-32',
							!steamProfile && 'opacity-30',
							isLoading && 'animate-pulse'
						)}
						src={steamProfile?.avatar || defaultAvatar}
					/>
					<div
						style={{maxWidth: 256}}
						class={classnames(
							'col-span-2 text-2xl truncate',
							!steamProfile && 'opacity-30',
							isLoading && 'animate-pulse'
						)}>
						{steamProfile?.displayName || 'Load steam library'}
					</div>
					<div
						style={{maxWidth: 256}}
						class={classnames(
							'col-span-2 text-base',
							!steamProfile && 'opacity-30',
							isLoading && 'animate-pulse'
						)}>
						{steamProfile?.games.length
							? `${steamProfile.games.length} games owned`
							: 'Load a steam profile to proceed'}
					</div>
					<ProfileUrlSubmit onSubmit={setProfileUrl} isLoading={isLoading} />
				</div>
				<Games
					games={steamProfile?.games || []}
					setGameView={setGameView}
					onRollEnd={() => setGameViewActive(true)}
				/>
			</div>
		)
	}

	return (
		<div class="relative h-full min-h-screen bg-gray-700 overflow-hidden">
			<div
				class={classnames(
					'h-96 translate flex items-center justify-center min-h-screen transform transition-transform duration-500',
					gameViewActive && '-translate-x-full'
				)}>
				{renderSpinner()}
			</div>
			<div
				class={classnames(
					'absolute top-0 w-full flex flex-col items-center justify-center h-full transform transition-transform duration-500',
					!gameViewActive && 'translate-x-full'
				)}>
				{gameView && <GameView game={gameView} isVisible={gameViewActive} />}
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
	const [selectedFilter, setSelectedFilter] = useState<PlaytimeFilterT>(PlaytimeFilter.ALL)
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
		if (games) {
			setVisibleGames((visibleGames) => {
				const filteredGames = games.filter(({playTime}) => {
					if (selectedFilter === PlaytimeFilter.ALL) return true
					if (selectedFilter === PlaytimeFilter.UNPLAYED_ONLY && !playTime) return true
					if (typeof selectedFilter === 'number') return playTime <= selectedFilter * 60
				})
				if (!filteredGames.length) {
					return []
				}
				if (visibleGames.length) {
					return visibleGames
						.slice(0, 5)
						.concat(mapKeys(randomSubarray(filteredGames, 60)))
				}
				return mapKeys(randomSubarray(filteredGames, 65))
			})
		}
	}, [games, selectedFilter])

	return (
		<div
			class={classnames(
				'flex flex-col items-center mt-auto transition-opacity',
				games.length ? 'opacity-100' : 'opacity-0'
			)}>
			<div
				class={classnames(
					'transition-opacity',
					isRolling ? 'opacity-50 pointer-events-none' : 'opacity-100'
				)}>
				<Filter selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
			</div>
			{visibleGames.length ? (
				<div
					style={{width: 4 * 240}}
					class="min-h-game-preview relative mt-6 overflow-hidden">
					<div
						class={classnames('flex', isRolling && 'games-rolling-animation')}
						style={{
							transform: 'translateX(calc(-0.5 * 240px)',
						}}>
						{visibleGames.map((game) => (
							<img
								key={game.key}
								class="h-game-preview w-game-preview min-w-game-preview object-cover"
								src={game.imageUrl}
								alt={game.name}
							/>
						))}
					</div>
					<div class="w-game-preview absolute left-1/2 top-0 h-full border-2 border-purple-700 transform -translate-x-1/2" />
					<div class="absolute top-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-700 via-transparent" />
				</div>
			) : (
				<div class="h-game-preview mt-6">None of your games match the selected filter</div>
			)}
			<Button
				onClick={handleRoll}
				disabled={isRolling || !visibleGames.length}
				class="mt-4 w-24">
				Roll
			</Button>
		</div>
	)
}

const ProfileUrlSubmit = ({
	onSubmit,
	isLoading,
}: {
	isLoading: boolean
	onSubmit: (profileUrl: string) => void
}) => {
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
				disabled={!value || isLoading}
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
