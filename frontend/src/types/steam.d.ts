export type SteamGameApi = {
	appid: number
	img_icon_url: string
	img_logo_url: string
	name: string
	playtime_forever: number
	playtime_linux_forever: number
	playtime_mac_forever: number
	playtime_windows_forever: number
}

export type SteamGame = {
	appId: number
	iconUrl: string
	logoUrl: string
	imageUrl: string
	name: string
	url: string
}
