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

export const FieldError = objectType({
	name: 'FieldError',
	definition(t) {
		t.string('field')
		t.string('message')
	}
})

export const UserResponse = objectType({
	name: 'UserResponse',
	definition(t) {
		t.nullable.list.field('errors', { type: FieldError })
		t.nullable.field('user', { type: User })
	}
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
			type: 'UserResponse',
			args: {
				options: 'UsernameAndPassword',
			},
			resolve: async (_root, args, ctx) => {
				const { options } = args

				if (options.username.length <= 2) {
					return {
						errors: [
							{
								field: 'username',
								message: 'Length must be greater than 2'
							}
						]
					}
				}

				if (options.password.length <= 3) {
					return {
						errors: [
							{
								field: 'password',
								message: 'Length must be greater than 3'
							}
						]
					}
				}

				const hashedPassword = await argon2.hash(options.password)

				const data = {
					password: hashedPassword,
					username: options.username,
				}

				try {
					await ctx.db.user.create({ data })
				} catch (err) {
					if (err.code = 'P2002') {
							return {
								errors: [{
									field: "username",
									message: "username already taken"
								}]
							}
					}
				}

				return { data }
			}
		}),
			t.field('login', {
				type: 'UserResponse',
				args: {
					options: 'UsernameAndPassword',
				},
				resolve: async (_root, args, ctx) => {
					const { options } = args
					const { username, password } = options
					const user = await ctx.db.user.findUnique({ where: { username } })

					if (!user) {
						return {
							errors: [{
								field: 'username',
								message: 'Username does not exists'
							}]
						}
					}

					const valid = await argon2.verify(user.password, password)
					if (!valid) {
						return {
							errors:
								[{
									field: "password",
									message: "Incorrect Password"
								}]
						}
					}

					return { user }
				}
			})
	}
})

