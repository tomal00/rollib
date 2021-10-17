const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.question(
	'Enter steam API key (get it here -> https://steamcommunity.com/dev/apikey):',
	(steamApiKey) => {
		rl.question('Enter allowed origins (CORS) or continue with default (*):', (cors) => {
			fs.writeFile(
				'./config.json',
				JSON.stringify({steamApiKey, cors: cors || '*'}),
				(err) => {
					err && console.error(err)
					!err && console.log(`${__dirname}/config.json\nDONE`)
					rl.close()
				}
			)
		})
	}
)
