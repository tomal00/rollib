export type SteamGame = {
	appId: number
	iconUrl: string
	logoUrl: string
	imageUrl: string
	name: string
	url: string
}

export type SteamProfile = {
	displayName: string
	avatar: string
	games: SteamGame[]
}
