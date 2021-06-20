import {useState, useEffect} from 'preact/hooks'
import debounce from 'lodash/debounce'

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState(() => ({
		width: window.innerWidth,
		height: window.innerHeight,
	}))

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		const handleResizeDebounced = debounce(handleResize, 100)
		window.addEventListener('resize', handleResizeDebounced)
		return () => window.removeEventListener('resize', handleResizeDebounced)
	}, [])

	return windowSize
}

export default useWindowSize
