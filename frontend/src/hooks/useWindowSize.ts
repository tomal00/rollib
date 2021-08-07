import {useState, useEffect} from 'preact/hooks'
import debounce from 'lodash/debounce'

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState(() => ({
		width: window.innerWidth,
		height: window.innerHeight,
		scrollWidth: document.body.scrollWidth,
	}))

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
				scrollWidth: document.body.scrollWidth,
			})
		}

		const handleResizeDebounced = debounce(handleResize, 100)
		window.addEventListener('resize', handleResizeDebounced)
		return () => window.removeEventListener('resize', handleResizeDebounced)
	}, [])

	return windowSize
}

export default useWindowSize
