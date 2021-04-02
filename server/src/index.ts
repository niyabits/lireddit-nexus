import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './entities'

import { context } from './context'

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

console.log(join(__dirname, "./context.ts"))

const apolloServer = new ApolloServer({
	schema,
	context,
});

apolloServer.applyMiddleware({ app, path: "/graphql", cors: false })

app.listen(4000, () => {
	console.log('🚀 Server Started on localhost:4000')
})
