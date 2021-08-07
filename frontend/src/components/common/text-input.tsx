import {useState} from 'preact/hooks'
import randomId from 'random-id'
import classnames from 'classnames'

type Props = {
	label?: string
	inputClass?: string
	[key: string]: any
}

const TextInput = ({label, inputClass, ...props}: Props) => {
	const [id] = useState<string | undefined>(label ? () => randomId(10) : undefined)

	return (
		<div
			class={classnames(
				'flex flex-col-reverse group text-gray-400 hover:text-gray-300 sm:focus-within:text-purple-500',
				props.class
			)}>
			<input
				{...props}
				class={classnames(
					'border-b-2 color-transition border-current focus:border-purple-500 focus:text-gray-200 bg-transparent placeholder-gray-400',
					!!label && 'mt-1',
					inputClass
				)}
				type="text"
				id={id}
			/>
			{label && (
				<label for={id} class="text-current text-xs color-transition">
					{label}
				</label>
			)}
		</div>
	)
}
export default TextInput
