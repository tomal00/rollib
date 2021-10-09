import {ComponentChild} from 'preact'
import classnames from 'classnames'

export enum SectionPosition {
	LEFT = '-translate-x-full',
	CENTER = 'translate-x-0',
	RIGHT = 'translate-x-full',
}

type SectionProps = {
	position: SectionPosition
	children: ComponentChild
}

export default function Section({position, children}: SectionProps): JSX.Element {
	return (
		<div
			class={classnames(
				'absolute h-screen top-0 w-full flex flex-col items-center justify-center transform transition-transform duration-500',
				position
			)}>
			{children}
		</div>
	)
}
