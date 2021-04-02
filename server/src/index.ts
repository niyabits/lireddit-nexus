import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './entities'

import { context } from './context'

import { __prod__ } from "./constants"

import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

export const schema = makeSchema({
	types,
	outputs: {
		typegen: join(__dirname, '..', 'nexus-typegen.ts'),
		schema: join(__dirname, '..', 'schema.graphql'),
	},

	contextType: {
		module: join(__dirname, './context.ts'),
		export: 'Context'
	},

	// Make nonNull the default
	nonNullDefaults: {
		input: true,
		output: true
	}

})

const app = express();

const RedisStore = connectRedis(session)
const redisClient = redis.createClient()

app.use(
	session({
		name: 'qid',
		store: new RedisStore({
			client: redisClient,
			disableTouch: true,
		}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
			httpOnly: true,
			sameSite: 'lax',
			secure: __prod__
		},
		saveUninitialized: false,
		secret: 'asjidyhgbasjkdb',
		resave: false,
	})
)

console.log(join(__dirname, "./context.ts"))

const apolloServer = new ApolloServer({
	schema,
	context,
});

apolloServer.applyMiddleware({ app, path: "/graphql", cors: false })

app.listen(4000, () => {
	console.log('🚀 Server Started on localhost:4000')
})
