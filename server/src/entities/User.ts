import { extendType, inputObjectType, objectType } from 'nexus'
import argon2 from 'argon2'

export const User = objectType({
	name: 'User',
	definition(t) {
		t.int('id')
		t.datetime('createdAt')
		t.datetime('updatedAt')
		t.string('username')
	},
})

export const UsernameAndPassword = inputObjectType({
	name: 'UsernameAndPassword',
	definition(t) {
		t.string('username')
		t.string('password')
	}
})

export const UserMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('register', {
			type: 'User',
			args: {
				options : 'UsernameAndPassword',
			},
			 resolve: async (_root, args, ctx) => {
				const hashedPassword = await argon2.hash(args.options.password)
				
				const user = {
					password: hashedPassword,
					username: args.options.username,
				}
				
				return ctx.db.user.create({ data: user })
			}
		})
	}
})


