import {useState} from 'preact/hooks'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'

type Props = {
	onSubmit: (profileUrl: string) => void
	default: boolean
	path: string
}

const ProfileSelection = ({onSubmit}: Props) => {
	const [profileUrl, setProfileUrl] = useState('')

	return (
		<div class="min-h-screen h-full flex justify-center items-center">
			<div class="flex flex-col justify-center">
				<TextInput
					label="Profile URL"
					placeholder="https://steamcommunity.com/id/sample-id"
					type="text"
					onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
						setProfileUrl(e.currentTarget.value)
					}
					value={profileUrl}
				/>
				<Button
					// Maybe add some proper validation
					disabled={!profileUrl}
					onClick={() => onSubmit(profileUrl)}
					class="self-center mt-2">
					Load Steam Library
				</Button>
			</div>
		</div>
	)
}

export default ProfileSelection
