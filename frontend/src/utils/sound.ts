import {useContext, StateUpdater} from 'preact/hooks'
import {createContext} from 'preact'
import rollSfx from '@Assets/roll.mp3'
import gameRevealSfx from '@Assets/game-reveal.mp3'
import rollBreakpoints from '@Assets/roll-breakpoints.json'

export enum Sound {
	ROLL,
	REVEAL,
}

const rollAudioBreakpoints = rollBreakpoints.map((timeout) => {
	const sound = new Audio(rollSfx)
	sound.volume = 0.15
	return {
		timeout,
		sound,
	}
})

const gameRevealSound = new Audio(gameRevealSfx)
gameRevealSound.volume = 0.15

export const soundContext = createContext<[boolean, StateUpdater<boolean>]>([false, () => null])

export const usePlaySound = (): ((sound: Sound) => void) => {
	const [isEnabled] = useContext(soundContext)

	return (sound: Sound): void => {
		if (!isEnabled) return

		if (sound === Sound.ROLL) {
			rollAudioBreakpoints.forEach(({timeout, sound}) => {
				setTimeout(() => sound.play(), timeout)
			})
		} else if (sound === Sound.REVEAL) {
			gameRevealSound.play()
		}
	}
}
