export type SteamGame = {
	appId: number
	iconUrl: string
	logoUrl: string
	imageUrl: string
	name: string
	url: string
	key?: string
}

export type SteamProfile = {
	displayName: string
	avatar: string
	games: SteamGame[]
}
