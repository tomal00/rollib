import type {AWS} from '@serverless/typescript'

import getSteamProfile from '@functions/getSteamProfile'
import getGameStoreInfo from '@functions/getGameStoreInfo'

import config from './config'

const serverlessConfiguration: AWS = {
	service: 'serverless',
	frameworkVersion: '2',
	custom: {
		webpack: {
			webpackConfig: './webpack.config.js',
			includeModules: true,
		},
	},
	plugins: ['serverless-webpack', 'serverless-offline'],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			STEAM_API_KEY: config.steamApiKey,
		},
		lambdaHashingVersion: '20201221',
	},
	// import the function via paths
	functions: {getSteamProfile, getGameStoreInfo},
}

module.exports = serverlessConfiguration
