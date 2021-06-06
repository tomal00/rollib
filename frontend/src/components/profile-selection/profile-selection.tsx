import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'

type Props = {
	onSubmit: (profileUrl: string) => void
	setProfileUrl: (profileUrl: string) => void
	profileUrl: string
}

const ProfileSelection = ({onSubmit, profileUrl, setProfileUrl}: Props) => (
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
				class="self-center">
				Load Steam Library
			</Button>
		</div>
	</div>
)

export default ProfileSelection
