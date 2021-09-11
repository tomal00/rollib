export default (minutesPlayed: number) => {
	if (minutesPlayed < 120) {
		if (minutesPlayed === 1) return `1 minute`

		return `${minutesPlayed} minutes`
	}

	if (minutesPlayed === 60) return '1 hour'

	return `${Number(minutesPlayed / 60).toFixed(1)} hours`
}
