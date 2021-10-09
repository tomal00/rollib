import {useState, useCallback, StateUpdater} from 'preact/hooks'

export default <T>(localStorageKey: string, defaultValue?: T): [any, StateUpdater<T>] => {
	const [state, setState] = useState<T>(() => {
		const item = localStorage.getItem(localStorageKey)
		if (item) {
			return JSON.parse(item)
		}
		return defaultValue
	})

	const setStateWithLocalStorage = useCallback(
		(value: T | ((prevState: T) => T)) => {
			localStorage.setItem(localStorageKey, JSON.stringify(value))
			return setState(value)
		},
		[localStorageKey]
	)

	return [state, setStateWithLocalStorage]
}
