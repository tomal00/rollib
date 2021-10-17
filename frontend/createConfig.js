const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.question('Enter API url or continue with default (http://localhost:3000/dev):', (apiUrl) => {
	fs.writeFile(
		'./config.json',
		JSON.stringify({apiUrl: apiUrl || 'http://localhost:3000/dev'}),
		(err) => {
			err && console.error(err)
			!err && console.log(`${__dirname}/config.json\nDONE`)
			rl.close()
		}
	)
})
