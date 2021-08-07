import {useQuery} from 'react-query'
import {useState} from 'preact/hooks'
import {FunctionalComponent} from 'preact'
import VirtualList from 'react-tiny-virtual-list'
import {QueryClient, QueryClientProvider} from 'react-query'
import classnames from 'classnames'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import useWindowSize from '@Hooks/useWindowSize'
import {SteamProfile} from '@Types/steam'
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

const fetchSteamProfile = (profileUrl: string): Promise<SteamProfile> =>
	fetch(`http://127.0.0.1:3000/dev/steam-profile?profileUrl=${profileUrl}`)
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			return data.steamProfile
		})

const App = () => {
	const [profileUrl, setProfileUrl] = useState<string>(
		'https://steamcommunity.com/id/65289138523698453/'
	)
	const {scrollWidth: scrollWidth} = useWindowSize()
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
	const listWidth = scrollWidth - 256 > 960 ? 960 : scrollWidth - 256
	const games = steamProfile?.games || []

	return (
		<div class="bg-gray-700 min-h-screen h-full flex flex-col justify-center items-center">
			<div class=" p-6 grid grid-rows-3 grid-cols-3 gap-2 gap-x-4 bg-purple-600 bg-opacity-5 w-max">
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
					{steamProfile?.displayName || 'Load a profile'}
				</div>
				<div
					style={{maxWidth: 256}}
					class={classnames('col-span-2 text-base', !steamProfile && 'opacity-30')}>
					{steamProfile?.games.length
						? `${steamProfile.games.length} games owned`
						: 'Enter steam profile URL and click the "Load" button'}
				</div>
				<ProfileUrlSubmit onSubmit={setProfileUrl} />
			</div>
			<VirtualList
				itemCount={games.length}
				width={listWidth}
				scrollDirection="horizontal"
				itemSize={213}
				height={124}
				class="scrollbar mt-24"
				renderItem={({index, style}: {index: number; style: JSX.CSSProperties}) => {
					const game = games[index]
					return (
						<img
							key={index}
							style={{...style, height: 100, objectFit: 'contain'}}
							src={game.imageUrl}
							title={game.name}
						/>
					)
				}}
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
				class="self-center w-24 mt-4 place-self-center">
				Load
			</Button>
		</>
	)
}

const WithQueryClient = (Component: FunctionalComponent) => (props: any) => (
	<QueryClientProvider client={queryClient} r>
		<Component {...props} />
	</QueryClientProvider>
)

export default WithQueryClient(App)
