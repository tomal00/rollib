export default function randomSubarray<T>(array: T[], subArrayLength: number): Array<T> {
	const subArray = []

	for (let i = 0; i < subArrayLength; i++) {
		subArray[i] = array[Math.floor(Math.random() * array.length)]
	}

	return subArray
}
