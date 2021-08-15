import {useQuery} from 'react-query'
import {useEffect, useState} from 'preact/hooks'
import {FunctionalComponent} from 'preact'
import {QueryClient, QueryClientProvider} from 'react-query'
import classnames from 'classnames'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import {SteamGame, SteamProfile} from '@Types/steam'
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
	// Use query instead of mutation to take advantage of caching -> gotta do these double-profileUrl state schenanigans
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

	return (
		<div class="flex flex-col items-center justify-center h-full min-h-screen bg-gray-700">
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
						: 'Enter steam profile URL and click the "Roll" button'}
				</div>
				<ProfileUrlSubmit onSubmit={setProfileUrl} />
			</div>
			<Games games={games} />
		</div>
	)
}

const Games = ({games}: {games: SteamGame[]}) => {
	const [didRerender, rerender] = useState(false)
	useEffect(() => {
		rerender(true)
	}, [])

	return (
		<div
			style={{width: 4 * 240}}
			class="relative mt-24 overflow-hidden"
			onClick={() => rerender(!didRerender)}>
			<div
				class="flex"
				style={{
					transitionTimingFunction: 'cubic-bezier(0,0,0.33,1)',
					transition: 'transform 5s',
					transform: didRerender
						? 'translateX(calc(-60.5 * 240px))'
						: 'translateX(calc(-10.5 * 240px))',
				}}>
				{games.slice(0, 70).map((game) => (
					<img
						key={game.appId}
						class="object-contain"
						src={game.imageUrl}
						alt={game.name}
						style={{
							width: 240,
							minWidth: 240,
						}}
					/>
				))}
			</div>
			<div
				class="absolute w-6 bg-black"
				style={{left: '50%', transform: 'translateX(-50%)', top: 0}}
			/>
		</div>
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
				Roll
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
