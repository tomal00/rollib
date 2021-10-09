import {useState} from 'preact/hooks'
import classnames from 'classnames'
import Button from '@Components/common/button'
import TextInput from '@Components/common/text-input'
import defaultAvatar from '@Assets/default-avatar.png'
import {SteamProfile} from '@Types/steam'

type ProfileSubmitProps = {
	isLoading: boolean
	onSubmit: (profileUrl: string) => void
}

export function ProfileSubmit({onSubmit, isLoading}: ProfileSubmitProps): JSX.Element {
	const [value, setValue] = useState<string>('')

	return (
		<>
			<TextInput
				label='Profile URL'
				placeholder='steamcommunity.com/id/sample'
				inputClass='min-w-0'
				type='text'
				class='col-span-2 self-center'
				onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
					setValue(e.currentTarget.value)
				}
				value={value}
			/>
			<Button
				// Maybe add some proper validation
				disabled={!value || isLoading}
				onClick={() => onSubmit(value)}
				class='self-center place-self-center mt-4 w-24'>
				Load
			</Button>
		</>
	)
}

type Props = {
	isLoading: boolean
	steamProfile?: SteamProfile
	setProfileUrl: (profileUrl: string) => void
}

export default function ProfileCard({isLoading, steamProfile, setProfileUrl}: Props): JSX.Element {
	return (
		<div class='grid gap-2 gap-x-4 grid-cols-3 grid-rows-3 p-6 w-max bg-purple-600 bg-opacity-5'>
			<img
				class={classnames(
					'row-span-2 h-32',
					!steamProfile && 'opacity-30',
					isLoading && 'animate-pulse'
				)}
				src={steamProfile?.avatar || defaultAvatar}
				height={128}
				width={128}
			/>
			<div
				style={{maxWidth: 256}}
				class={classnames(
					'col-span-2 text-2xl truncate',
					!steamProfile && 'opacity-30',
					isLoading && 'animate-pulse'
				)}>
				{steamProfile?.displayName || '[Your steam nickname]'}
			</div>
			<div
				style={{maxWidth: 256}}
				class={classnames(
					'col-span-2 text-base',
					!steamProfile && 'opacity-30',
					isLoading && 'animate-pulse'
				)}>
				{steamProfile?.games.length
					? `${steamProfile.games.length} games owned`
					: '[Your steam library size]'}
			</div>
			<ProfileSubmit onSubmit={setProfileUrl} isLoading={isLoading} />
		</div>
	)
}
