const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('bearer ')) {
        return authorization.replace('bearer ', '')
    }
    return null
}


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)
	if(blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title, 
        author: body.author, 
        url: body.url, 
        likes: body.likes || 0,
        user: user.id
    })
    
	if(!blog.get('title') || !blog.get('url')) {
		response.status(400).end()
	} else {
   		const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog.id)
      await user.save()
      await savedBlog.populate('user', { username: 1, name: 1 })
		  response.status(201).json(savedBlog)
	} 
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if(blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
	    response.status(204).end()
    }
    return response.status(401).json({ error: 'invalid token' })
})

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body
	const blog = await Blog.findById(request.params.id)
	if(!blog) {
		response.status(404).end()
	} else {
		const newBlog = {
			title: blog.title,
			author: blog.author,
			url: blog.url,
			likes: body.likes
		}

		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})
		response.json(updatedBlog)
	}
})

module.exports = blogsRouter
