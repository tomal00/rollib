const {solveCubic} = require('@thi.ng/math')
const fs = require('fs')

// generate breakpoints according to cubic-bezier(0,0,0.33,1) to play sound on each breakpoint
const breakpointCount = 50
const breakpointTimes = []
const increment = breakpointCount
const animationLength = 5000

// Close enough but not 100% in sync
// Probably due to assumption that 1/3 === 0.33 and due to the fact that the timeouts are not set at the same tick when the component rerenders and the animation starts
for (let i = 1; i < breakpointCount; i++) {
	// y is progression of the animation
	const y = (1 / 50) * i
	// 2root^3 - 3root^2 - y = 0
	const root = solveCubic(2, -3, 0, y).filter((root) => root >= 0 && root <= 1)
	// X(root) = root^2;
	breakpointTimes.push(Math.pow(root, 2) * animationLength)
}

fs.writeFile('./assets/roll-breakpoints.json', JSON.stringify(breakpointTimes), (err) => {
	err && console.error(err)
	!err && console.log('DONE')
})
