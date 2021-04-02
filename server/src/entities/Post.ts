import { extendType, intArg, objectType, stringArg } from 'nexus'

export const Post = objectType({
	name: 'Post',
	definition(t) {
		t.int('id')
		t.string('title')
		t.datetime('createdAt')
		t.datetime('updatedAt')
	},
})
 
export const PostQuery = extendType({
	type: 'Query',
	definition(t) {
		t.list.field('posts', {
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
		t.field('createPost', {
			type: 'Post',
			args: {
				title: stringArg(),
			},
			resolve(_root, args, ctx) {
				const post = {
					title: args.title,
				}
				return ctx.db.post.create({ data: post })
			}
		})

		t.field('updatePost', {
			type: 'Post',
			args: {
				id: intArg(),
				title: stringArg(),
			},
			resolve(_root, args, ctx) {
				return ctx.db.post.update({ where: { id: args.id }, data: { title: args.title } })
			}
		})

		t.field('deletePost', {
			type: 'Post',
			args: {
				id: intArg(),
			},
			resolve(_root, args, ctx) {
				return ctx.db.post.delete({ where: { id: args.id } })
			}
		})

	}
})

