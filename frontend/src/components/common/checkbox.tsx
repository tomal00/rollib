import {useState} from 'preact/hooks'
import randomId from 'random-id'
import classnames from 'classnames'

const CheckBox = ({label, ...props}: {label?: string; [key: string]: any}) => {
	const [id] = useState<string | undefined>(label ? () => randomId(10) : undefined)

	return (
		<div class={classnames(props.class)}>
			<input
				{...props}
				class={classnames('mr-1', props.checkboxClass)}
				type="checkbox"
				id={id}
			/>
			{label && <label for={id}>{label}</label>}
		</div>
	)
}

export default CheckBox
