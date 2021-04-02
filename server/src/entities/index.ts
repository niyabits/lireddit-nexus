import { decorateType } from 'nexus'
import { GraphQLDateTime } from 'graphql-scalars'

export const GQLDateTime = decorateType(GraphQLDateTime, {
	sourceType: 'DateTime',
	asNexusMethod: 'datetime',
})

export * from './User'
export * from './Post'
