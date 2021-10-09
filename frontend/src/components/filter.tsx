import {useState, useCallback} from 'preact/hooks'
import {ComponentChild} from 'preact'
import debounce from 'lodash/debounce'
import classnames from 'classnames'

export enum PlaytimeFilter {
	ALL = 'ALL',
	UNPLAYED_ONLY = 'UNPLAYED_ONLY',
}

export type PlaytimeFilterT = PlaytimeFilter | number

type FilterOptionProps = {
	isSelected: boolean
	onSelect: () => void
	children: ComponentChild
}

function FilterOption({isSelected, onSelect, children}: FilterOptionProps) {
	return (
		<div
			onClick={onSelect}
			class={classnames(
				'p-1 cursor-pointer border-b-2 border-transparent transition-colors',
				isSelected
					? ' border-purple-700 text-white'
					: 'hover:border-purple-500 text-gray-400'
			)}>
			{children}
		</div>
	)
}

type Props = {
	selectedFilter: PlaytimeFilterT
	setSelectedFilter: (filter: PlaytimeFilterT) => void
}

export default function Filter({selectedFilter, setSelectedFilter}: Props): JSX.Element {
	const [maxHours, setMaxHours] = useState(0)
	const setSelectedFilterDebounced = useCallback(debounce(setSelectedFilter, 300), [
		setSelectedFilter,
	])

	return (
		<div class='flex items-end select-none space-x-8'>
			<FilterOption
				isSelected={selectedFilter === PlaytimeFilter.ALL}
				onSelect={() => setSelectedFilter(PlaytimeFilter.ALL)}>
				All games
			</FilterOption>
			<FilterOption
				isSelected={selectedFilter === PlaytimeFilter.UNPLAYED_ONLY}
				onSelect={() => setSelectedFilter(PlaytimeFilter.UNPLAYED_ONLY)}>
				Unplayed only
			</FilterOption>
			<FilterOption
				isSelected={typeof selectedFilter === 'number'}
				onSelect={() => setSelectedFilter(PlaytimeFilter.UNPLAYED_ONLY)}>
				<label for='max-hours' class='text-inherit block text-xs'>
					Max hours
				</label>
				<input
					id='max-hours'
					class='w-20 text-current bg-transparent'
					min={0}
					max={9999}
					type='number'
					value={maxHours}
					onChange={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
						const val = Math.abs(Number(e.currentTarget.value))
						setMaxHours(val)
						setSelectedFilterDebounced(val)
					}}
				/>
			</FilterOption>
		</div>
	)
}
