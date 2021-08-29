export default (array: any[], subArrayLength: number) => {
	const subArray = []

	for (let i = 0; i < subArrayLength; i++) {
		subArray[i] = array[Math.floor(Math.random() * array.length)]
	}

	return subArray
}
