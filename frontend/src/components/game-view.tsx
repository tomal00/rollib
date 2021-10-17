import {useLayoutEffect, useState, useRef, useEffect} from 'preact/hooks'
import {useQuery} from 'react-query'
import classnames from 'classnames'
import AnchorButton from '@Components/common/anchor-button'
import {SteamGame, StoreAsset, StoreInfo} from '@Types/steam'
import minsToPlaytime from '@Utils/mins-to-playtime'
import steamLogo from '@Assets/steam-logo.svg'
import playIcon from '@Assets/play.svg'

const fetchGameStoreInfo = (appId: number): Promise<StoreInfo> =>
	fetch(`http://localhost:3000/dev/store-info?appId=${appId}`, {cache: 'force-cache'})
		.then((res) => res.json().then((data) => ({status: res.status, data})))
		.then(({status, data}) => {
			if (status >= 400) throw new Error(data.message)

			return data
		})

type Props = {
	game: SteamGame
	isVisible: boolean
}

export default function GameView({game, isVisible}: Props): JSX.Element {
	const [activePreview, setActivePreview] = useState<StoreAsset | null>(null)
	const activeVideoRef = useRef<HTMLVideoElement>()
	const {data: {assets = [], description = ''} = {}, isError} = useQuery(
		`store-info-${game.appId}`,
		() => fetchGameStoreInfo(game.appId),
		{
			staleTime: Infinity,
			cacheTime: Infinity,
			retry: false,
			onSuccess: ({assets = [null]}) => {
				setActivePreview(assets[0])
			},
		}
	)

	useEffect(() => {
		if (isVisible) {
			setTimeout(() => activeVideoRef.current?.play(), 750)
		} else {
			activeVideoRef.current?.pause()
		}
	}, [isVisible])

	useLayoutEffect(() => {
		if (activePreview?.type === 'video' && isVisible) {
			activeVideoRef.current.play()
		}
	}, [activePreview])

	if (isError) {
		return (
			<div>
				<div class='text-3xl'>{game.name}</div>
				<img class='mb-6 mt-6 w-auto h-auto' src={game.imageUrl} />
				<div class='w-96'>
					Unfortunately this product seems not to be available in the steam store at this
					moment and thus it's not possible to display any further info.
				</div>
				<div class='text-center'>
					<AnchorButton
						class={classnames('mt-6', isVisible && 'animate-expand')}
						href={`steam://run/${game.appId}`}>
						<b>Play now</b>
					</AnchorButton>
				</div>
			</div>
		)
	}

	const activePreviewClassNames =
		'w-active-preview h-active-preview max-h-active-preview col-span-4 row-span-4'

	return (
		<div class='grid gap-6 grid-cols-6 m-3 max-w-4xl auto-rows-auto'>
			<div class='col-span-6 text-3xl'>{game.name}</div>
			{activePreview?.type === 'video' ? (
				<video
					ref={activeVideoRef}
					key={activePreview?.id}
					class={classnames(activePreviewClassNames, 'bg-black')}
					controls
					playsInline
					muted>
					<source src={activePreview?.url} type='video/webm' />
				</video>
			) : (
				<img
					class={classnames(activePreviewClassNames, 'object-cover')}
					src={activePreview?.url}
				/>
			)}
			<div class='flex flex-col col-span-2 row-span-4'>
				<img class='mb-3' src={game.imageUrl} />
				<div
					class='line-clamp-6 mb-2 text-sm'
					// Special characters :/ - sanitized by BE just in case
					dangerouslySetInnerHTML={{__html: description}}
				/>
				<div class='mb-1 mt-auto'>
					<b>
						{game.playTime
							? `${minsToPlaytime(game.playTime)} on record`
							: 'You have never played this game'}
					</b>
				</div>
				<div>
					<a
						rel='noreferrer noopener'
						target='_blank'
						href={`https://store.steampowered.com/app/${game.appId}`}
						class='hover:text-purple-400 underline transition-colors'>
						<img class='inline mr-1 h-6' src={steamLogo} />
						Steam store link
					</a>
				</div>
			</div>
			<div class='scrollbar col-span-6 pb-2 whitespace-nowrap select-none overflow-x-auto space-x-2'>
				{assets.map((asset) =>
					asset.type === 'video' ? (
						<div
							key={asset.id}
							onClick={() => setActivePreview(asset)}
							class={classnames(
								'relative inline-block cursor-pointer transition-opacity',
								asset !== activePreview && 'opacity-30 hover:opacity-70'
							)}>
							<img class='inline h-16' src={asset.thumbnail} />
							<img
								class='absolute left-1/2 top-1/2 h-6 transform -translate-x-1/2 -translate-y-1/2'
								src={playIcon}
							/>
						</div>
					) : (
						<img
							key={asset.id}
							onClick={() => setActivePreview(asset)}
							src={asset.thumbnail}
							class={classnames(
								'inline h-16 cursor-pointer transition-opacity',
								asset !== activePreview && 'opacity-30 hover:opacity-70'
							)}
						/>
					)
				)}
			</div>
			<AnchorButton
				class={classnames('col-span-6 place-self-center', isVisible && 'animate-expand')}
				href={`steam://run/${game.appId}`}>
				<b>Play now</b>
			</AnchorButton>
		</div>
	)
}
