import {useContext} from 'preact/hooks'
import {soundContext} from '@Utils/sound'
import Button from '@Components/common/button'

export default function SoundToggle(): JSX.Element {
	const [isEnabled, setIsEnabled] = useContext(soundContext)

	return (
		<Button
			onClick={() => setIsEnabled(!isEnabled)}
			class='absolute left-6 top-6 text-gray-300 hover:text-purple-500 text-3xl'
			colorClassNames='bg-auto'>
			Sound {isEnabled ? 'ON' : 'OFF'}
		</Button>
	)
}
