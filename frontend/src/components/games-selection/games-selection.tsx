import {useState, useMemo} from 'preact/hooks'
import classnames from 'classnames'
import VirtualList from 'react-tiny-virtual-list'
import {SteamGame} from '@Types/steam'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import CheckBox from '@Components/common/checkbox'
import useSteamLibrary from '@Hooks/useSteamLibrary'
import useWindowSize from '@Hooks/useWindowSize'

type Props = {
	onSpin: (games: SteamGame[]) => void
	path: string
	matches?: {profileUrl: string}
}

const ITEM_TOTAL_WIDTH = 224
const ITEM_TOTAL_HEIGHT = 162.5
const LIST_PADDING = 16
const BOTTOM_BAR_HEIGHT = 144

const GamesSelection = ({onSpin, matches}: Props) => {
	const [filteredGames, setFilteredGames] = useState<{[key: string]: boolean}>({})
	const [areFilteredHidden, setAreFilteredHidden] = useState<boolean>(false)
	const [areSelectedHidden, setAreSelectedHidden] = useState<boolean>(false)
	const [searchvalue, setSearchValue] = useState<string>('')
	const steamLibrary = useSteamLibrary(matches?.profileUrl || '')
	const windowSize = useWindowSize()

	const handleSpin = () => {
		const selection = steamLibrary.filter(({appId}) => !filteredGames[appId])
		onSpin(selection)
	}

	const toggleGameFilter = (appId: number) =>
		setFilteredGames((games) => ({
			...games,
			[appId]: !games[appId],
		}))

	const shownGamesInRows = useMemo(() => {
		const itemsPerRow =
			Math.floor((windowSize.width - 2 * LIST_PADDING) / ITEM_TOTAL_WIDTH) || 1
		return steamLibrary
			.filter(({name, appId}) => {
				const isFiltered = !!filteredGames[appId]

				if (isFiltered && areFilteredHidden) return false
				if (!isFiltered && areSelectedHidden) return false
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
			.reduce(
				(acc: SteamGame[][], game) => {
					if (!acc[acc.length - 1] || acc[acc.length - 1].length >= itemsPerRow) {
						acc.push([])
					}
					acc[acc.length - 1].push(game)

					return acc
				},
				[[]]
			)
	}, [steamLibrary, filteredGames, areFilteredHidden, areSelectedHidden, searchvalue, windowSize])

	// TODO - some loading state would be nice
	return (
		<div class="flex flex-col h-screen">
			<div>
				<VirtualList
					className="p-4"
					width="100%"
					height={windowSize.height - BOTTOM_BAR_HEIGHT}
					itemCount={shownGamesInRows.length}
					itemSize={ITEM_TOTAL_HEIGHT}
					renderItem={({
						index,
						style,
					}: {
						index: number
						style: string | JSX.CSSProperties | undefined
					}) => {
						const row = shownGamesInRows[index]
						return (
							<div class="flex justify-center" key={index} style={style}>
								{row.map(({name, imageUrl, appId}) => {
									const isFiltered = !!filteredGames[appId]
									// DO NOT CREATE A COMPONENT FOR THE GAME PREVIEW
									// Vite really doesn't like it 🤷
									return (
										<div
											class={classnames(
												'select-none flex-shrink-0 w-48 text-center bg-red-800 p-2 text-white rounded m-4 cursor-pointer transition-opacity duration-150',
												isFiltered
													? 'opacity-25 hover:opacity-50'
													: 'hover:opacity-75'
											)}
											onClick={() => toggleGameFilter(appId)}>
											<img class="rounded" src={imageUrl} />
											<div class="mt-2 overflow-ellipsis whitespace-nowrap overflow-hidden">
												{name}
											</div>
										</div>
									)
								})}
							</div>
						)
					}}
				/>
			</div>
			<div class="h-36 flex-shrink-0 flex justify-center items-center">
				<TextInput
					value={searchvalue}
					onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
						setSearchValue(e.currentTarget.value)
					}
					label="Filter by name"
					placeholder="Counter-Strike"
				/>
				<CheckBox
					label="Hide filtered"
					onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
						setAreFilteredHidden((e.target as HTMLInputElement).checked)
					}}
				/>
				<CheckBox
					label="Hide selected"
					onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
						setAreSelectedHidden((e.target as HTMLInputElement).checked)
					}}
				/>
				<Button disabled={!steamLibrary.length} class="mt-2" onClick={handleSpin}>
					Spin
				</Button>
			</div>
		</div>
	)
}

export default GamesSelection
