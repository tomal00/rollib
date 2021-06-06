import {useState} from 'preact/hooks'
import randomId from 'random-id'

const CheckBox = ({label, ...props}: {label?: string; [key: string]: any}) => {
	const [id] = useState<string | undefined>(label ? () => randomId(10) : undefined)

	return (
		<div>
			<input {...props} type="checkbox" id={id} />
			{label && <label for={id}>{label}</label>}
		</div>
	)
}

export default CheckBox
