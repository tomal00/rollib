import {useState, useMemo, useEffect} from 'preact/hooks'
import classnames from 'classnames'
import VirtualList from 'react-tiny-virtual-list'
import {useQuery} from 'react-query'
import {SteamGame} from '@Types/steam'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import CheckBox from '@Components/common/checkbox'
import GamePreview from '@Components/game-preview'
import useWindowSize from '@Hooks/useWindowSize'

type Props = {
	onSpin: (games: SteamGame[]) => void
	path: string
	matches?: {profileUrl: string}
}

const ITEM_TOTAL_HEIGHT = 40

/*const fetchSteamLibrary = (profileUrl: string): Promise<SteamGame[]> =>
	fetch(`http://127.0.0.1:3000/dev/steam-profile?profileUrl=${profileUrl}`)
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			return data.games.map(({appid, img_icon_url, name}: SteamGameApi) => ({
				appId: appid,
				iconUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`,
				imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`,
				name,
				url: `https://store.steampowered.com/app/${appid}`,
			}))
		})
*/
const GamesSelection = ({onSpin, matches}: Props) => {
	const {height: windowHeight} = useWindowSize()
	const [filteredGames, setFilteredGames] = useState<{[key: string]: boolean}>({})
	const [showOnlyExcluded, setShowOnlyExcluded] = useState<boolean>(false)
	const [searchvalue, setSearchValue] = useState<string>('')
	const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null)
	const profileUrl = matches?.profileUrl || ''
	const {data: steamLibrary = []} = useQuery(profileUrl, () => fetchSteamLibrary(profileUrl), {
		onError: (e) => {
			alert(e)
		},
		onSuccess: (steamLibrary) => {
			setSelectedGame(steamLibrary[0])
		},
		staleTime: Infinity,
		retry: false,
	})

	const handleSpin = () => {
		const selection = steamLibrary.filter(({appId}) => !filteredGames[appId])
		onSpin(selection)
	}

	const toggleGameFilter = (appId: number) =>
		setFilteredGames((games) => ({
			...games,
			[appId]: !games[appId],
		}))

	const games = useMemo(() => {
		return steamLibrary.filter(({name, appId}) => {
			const isFiltered = !!filteredGames[appId]

			if (!isFiltered && showOnlyExcluded) return false
			if (
				searchvalue &&
				!name
					.replaceAll(/\s/g, '')
					.toLowerCase()
					.includes(searchvalue.replaceAll(/\s/g, '').toLowerCase())
			) {
				return false
			}

			return true
		})
	}, [steamLibrary, filteredGames, showOnlyExcluded, searchvalue])

	// TODO - some loading state would be nice
	return (
		<div class="flex h-screen justify-center px-24 py-12">
			<div class="w-72 h-full flex flex-col p-4 mr-12 bg-purple-600 bg-opacity-5">
				<div>
					<TextInput
						value={searchvalue}
						placeholder="Search..."
						class=""
						onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
							setSearchValue(e.currentTarget.value)
						}
					/>
					<CheckBox
						label="Show only excluded"
						class="my-2"
						onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
							setShowOnlyExcluded((e.target as HTMLInputElement).checked)
						}}
					/>
				</div>
				<VirtualList
					width="100%"
					/*
						Won't actually make the list overflow, height just handles how
						many children are rendered in the dom.
						*/
					height={windowHeight}
					class="scrollbar pr-1"
					itemCount={games.length}
					itemSize={ITEM_TOTAL_HEIGHT}
					renderItem={({
						index,
						style,
					}: {
						index: number
						style: string | JSX.CSSProperties | undefined
					}) => {
						const game = games[index]
						const isSelected = selectedGame === game
						return (
							<div key={index} style={style}>
								<button
									onClick={() => setSelectedGame(game)}
									class={classnames(
										'flex flex-nowrap align box-border w-full items-center py-1 px-2 color-transition',
										isSelected && 'bg-purple-600'
									)}>
									<img class="h-8 w-8" src={game.iconUrl} />
									<span class="ml-2 truncate">{game.name}</span>
								</button>
							</div>
						)
					}}
				/>
			</div>
			<div>
				{selectedGame && <GamePreview game={selectedGame} />}
				<Button disabled={!steamLibrary.length} onClick={handleSpin}>
					Spin
				</Button>
			</div>
		</div>
	)
}

export default GamesSelection
