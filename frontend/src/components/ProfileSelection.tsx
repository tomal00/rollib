type Props = {
	onSubmit: (profileUrl: string) => void
	setProfileUrl: (profileUrl: string) => void
	profileUrl: string
}

const ProfileSelection = ({onSubmit, profileUrl, setProfileUrl}: Props) => (
	<div class="h-full flex justify-center items-center">
		<div class="flex flex-col justify-center">
			<div class="flex flex-col-reverse group text-red-300 hover:text-red-500 sm:focus-within:text-red-700">
				<input
					class="p-2 w-72 md:w-96 border-2 text-current color-transition border-current placeholder-red-200"
					placeholder="https://steamcommunity.com/id/sample-id"
					type="text"
					onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
						setProfileUrl(e.currentTarget.value)
					}
					value={profileUrl}
				/>
				<label class="text-current color-transition">Profile URL</label>
			</div>
			<button
				// Maybe add some proper validation
				disabled={!profileUrl}
				onClick={() => onSubmit(profileUrl)}
				class={
					'w-36 md:w-48 mt-2 self-center color-transition text-white disabled:bg-red-300 disabled:cursor-not-allowed bg-red-500 hover:bg-red-700'
				}>
				Load Steam Library
			</button>
		</div>
	</div>
)

export default ProfileSelection
