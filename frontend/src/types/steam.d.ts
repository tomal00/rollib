export type SteamGame = {
	appId: number
	iconUrl: string
	logoUrl: string
	imageUrl: string
	name: string
	url: string
	key?: string
}

type StoreAsset = {
	id: number
	url: string
	thumbnail: string
}

export type StoreInfo = {
	description: string
	images: StoreAsset[]
	videos: StoreAsset[]
}

export type SteamProfile = {
	displayName: string
	avatar: string
	games: SteamGame[]
}
