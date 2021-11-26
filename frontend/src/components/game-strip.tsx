import {useEffect, useState, useMemo} from 'preact/hooks'
import classnames from 'classnames'
import Button from '@Components/common/button'
import Filter, {PlaytimeFilter, PlaytimeFilterT} from '@Components/filter'
import {SteamGame} from '@Types/steam'
import randomSubarray from '@Utils/random-subarray'
import {usePlaySound, Sound} from '@Utils/sound'

// hack so that keys are unique and keys of visible items stay the same between renders
let acc = 0
const mapKeys = (games: SteamGame[]): SteamGame[] => {
	for (let i = 0; i < games.length; i++) {
		games[i] = {...games[i], key: String(acc)}
		acc++
	}
	return games
}

type Props = {
	games: SteamGame[]
	setGameView: (game: SteamGame) => void
	onRollEnd: () => void
}

export default function GameStrip({games, onRollEnd, setGameView}: Props): JSX.Element {
	const [visibleGames, setVisibleGames] = useState<SteamGame[]>([])
	const [selectedFilter, setSelectedFilter] = useState<PlaytimeFilterT>(PlaytimeFilter.ALL)
	const [isRolling, setIsRolling] = useState(false)
	const playSound = usePlaySound()

	const filteredGames = useMemo(
		() =>
			games.filter(({playTime}) => {
				if (selectedFilter === PlaytimeFilter.ALL) return true
				if (selectedFilter === PlaytimeFilter.UNPLAYED_ONLY && !playTime) return true
				if (typeof selectedFilter === 'number') return playTime <= selectedFilter * 60
			}),
		[games, selectedFilter]
	)

	const handleRoll = () => {
		setIsRolling(true)
		setGameView(visibleGames[32])
		setTimeout(() => {
			playSound(Sound.REVEAL)
			onRollEnd()

			// Timeout so that it doesn't rerender such a big list during transition to GameView which would cause stuttering
			setTimeout(() => {
				setVisibleGames([
					...visibleGames.slice(-5),
					...mapKeys(randomSubarray(filteredGames, 30)),
				])
				setIsRolling(false)
			}, 1000)
		}, 5000)
	}

	useEffect(() => {
		if (isRolling) {
			playSound(Sound.ROLL)
		}
	}, [isRolling])

	useEffect(() => {
		setVisibleGames((visibleGames) => {
			if (!filteredGames.length) {
				return []
			}
			if (visibleGames.length) {
				return visibleGames.slice(0, 5).concat(mapKeys(randomSubarray(filteredGames, 30)))
			}
			return mapKeys(randomSubarray(filteredGames, 35))
		})
	}, [filteredGames])

	return (
		<div class='flex flex-col items-center mt-auto'>
			<div
				class={classnames(
					'transition-opacity',
					isRolling ? 'opacity-50 pointer-events-none' : 'opacity-100'
				)}>
				<Filter selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
			</div>
			{visibleGames.length ? (
				<div class='min-h-game-preview w-game-preview-2 lg:w-game-preview-4 relative mt-6 overflow-hidden'>
					<div
						class={classnames(
							'flex transform -translate-x-game-preview-1/2 relative lg:right-0 right-game-preview',
							isRolling && 'games-rolling-animation'
						)}>
						{visibleGames.map((game) => (
							<img
								key={game.key}
								class='h-game-preview min-w-game-preview object-cover'
								src={game.imageUrl}
								alt={game.name}
							/>
						))}
					</div>
					<div
						class={classnames(
							'absolute left-1/2 top-0 h-full border-2 border-purple-700 transform -translate-x-1/2 transition-all',
							isRolling ? 'w-0' : 'w-game-preview'
						)}
					/>
					<div class='absolute top-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-700 via-transparent' />
				</div>
			) : (
				<div class='h-game-preview mt-6'>None of your games match the selected filter</div>
			)}
			<Button
				onClick={handleRoll}
				disabled={isRolling || !visibleGames.length}
				class='mt-4 w-24'>
				Roll
			</Button>
		</div>
	)
}
