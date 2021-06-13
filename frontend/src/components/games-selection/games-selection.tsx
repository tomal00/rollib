import {useState} from 'preact/hooks'
import classnames from 'classnames'
import {SteamGame} from '@Types/steam'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import CheckBox from '@Components/common/checkbox'

type Props = {
	steamLibrary: SteamGame[]
	onSpin: (games: SteamGame[]) => void
}

// TODO - Implement custom virtual list or use preact/compat and use some react lib
// This is kinda important since now it's LAGGY AF (probably)
const GamesSelection = ({steamLibrary, onSpin}: Props) => {
	const [filteredGames, setFilteredGames] = useState<{[key: string]: boolean}>({})
	const [areFilteredHidden, setAreFilteredHidden] = useState<boolean>(false)
	const [areSelectedHidden, setAreSelectedHidden] = useState<boolean>(false)
	const [searchvalue, setSearchValue] = useState<string>('')
	const handleSpin = () => {
		const selection = steamLibrary.filter(({appId}) => !filteredGames[appId])
		onSpin(selection)
	}

	const toggleGameFilter = (appId: number) =>
		setFilteredGames((games) => ({
			...games,
			[appId]: !games[appId],
		}))

	return (
		<div class="flex flex-col h-screen">
			<div class="flex flex-wrap items-start mb-auto justify-center overflow-auto">
				{steamLibrary.map(({name, imageUrl, appId}) => {
					const isFiltered = !!filteredGames[appId]

					if (isFiltered && areFilteredHidden) return null
					if (!isFiltered && areSelectedHidden) return null
					if (
						searchvalue &&
						!name
							.replaceAll(/\s/g, '')
							.toLowerCase()
							.includes(searchvalue.replaceAll(/\s/g, '').toLowerCase())
					) {
						return null
					}

					return (
						<GameCard
							isFiltered={isFiltered}
							name={name}
							image={imageUrl}
							onToggleFilter={() => toggleGameFilter(appId)}
						/>
					)
				})}
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
				<Button class="mt-2" onClick={handleSpin}>
					Spin
				</Button>
			</div>
		</div>
	)
}

type GameCardProps = {
	image: string
	name: string
	isFiltered: boolean
	onToggleFilter: () => void
}

const GameCard = ({image, name, isFiltered, onToggleFilter}: GameCardProps) => (
	<div
		class={classnames(
			'select-none w-48 text-center bg-red-800 p-2 text-white rounded m-4 cursor-pointer transition-opacity duration-150',
			isFiltered ? 'opacity-25 hover:opacity-50' : 'hover:opacity-75'
		)}
		onClick={onToggleFilter}>
		<img class="rounded" src={image} />
		<div class="mt-2 overflow-ellipsis whitespace-nowrap overflow-hidden">{name}</div>
	</div>
)

export default GamesSelection
