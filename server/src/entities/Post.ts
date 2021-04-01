import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus'

export const Post = objectType({
	name: 'Post',
	definition(t) {
		t.nonNull.int('id')
		t.nonNull.string('title')
		t.nonNull.datetime('createdAt')
		t.nonNull.datetime('updatedAt')
	},
})

export const PostQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('posts', {
			type: 'Post',
			resolve(_root, _args, ctx) {
				return ctx.db.post.findMany()
			}
		})
	}
})

export const PostMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createPost', {
			type: 'Post',
			args: {
				title: nonNull(stringArg()),
			},
			resolve(_root, args, ctx) {
				const post = {
					title: args.title,
				}
				return ctx.db.post.create({ data: post })
			}
		})

		t.nonNull.field('updatePost', {
			type: 'Post',
			args: {
				id: nonNull(intArg()),
				title: nonNull(stringArg()),
			},
			resolve(_root, args, ctx) {
				return ctx.db.post.update({ where: { id: args.id }, data: { title: args.title } })
			}
		})

		t.nonNull.field('deletePost', {
			type: 'Post',
			args: {
				id: nonNull(intArg()),
			},
			resolve(_root, args, ctx) {
				return ctx.db.post.delete({ where: { id: args.id } })
			}
		})

	}
})

