const {solveCubic} = require('@thi.ng/math')
const fs = require('fs')

// generate breakpoints according to cubic-bezier(0,0,0.33,1) to play sound on each breakpoint
const breakpointCount = 30
const breakpointTimes = []
const animationDuration = 5000
const breakpointsHalved = breakpointCount * 2

// Can't even explain how it works anymore, it just does.
for (let i = 1; i < breakpointsHalved; i += 2) {
	// y is progression of the animation
	const y = (1 / breakpointsHalved) * i
	// 2root^3 - 3root^2 - y = 0
	const root = solveCubic(2, -3, 0, y).filter((root) => root >= 0 && root <= 1)
	// X(root) = root^2;
	breakpointTimes.push(Math.pow(root, 2) * animationDuration)
}

fs.writeFile('./assets/roll-breakpoints.json', JSON.stringify(breakpointTimes), (err) => {
	err && console.error(err)
	!err && console.log('DONE')
})
