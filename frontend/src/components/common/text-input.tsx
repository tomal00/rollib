import {useState} from 'preact/hooks'
import randomId from 'random-id'

const TextInput = ({label, ...props}: {label?: string; [key: string]: any}) => {
	const [id] = useState<string | undefined>(label ? () => randomId(10) : undefined)

	return (
		<div class="flex flex-col-reverse group text-black hover:text-red-400 sm:focus-within:text-red-600">
			<input
				{...props}
				class="p-2 w-72 md:w-96 border-2 text-current color-transition border-current bg-transparent placeholder-black"
				type="text"
				id={id}
			/>
			{label && (
				<label for={id} class="text-current color-transition">
					{label}
				</label>
			)}
		</div>
	)
}

export default TextInput
