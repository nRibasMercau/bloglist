const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs
		.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

test('blogs are returned in json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('the unique identifier property of the blog is named id', async () => {
	const response = await api.get('/api/blogs')
	expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
	const newBlog = {
		title: "Asynchronous Design Critique: Giving Feedback", 
		author: "Erin Casali",
		url: "https://alistapart.com/article/async-design-critique-giving-feedback/",
		likes: 101
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

	const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
	expect(lastBlog.title).toBe(newBlog.title)
	expect(lastBlog.author).toBe(newBlog.author)
	expect(lastBlog.url).toBe(newBlog.url)
	expect(lastBlog.likes).toBe(newBlog.likes)
})

test('the likes of a blog with no likes defaults to zero', async () => {
	const newBlog = {
		title: "Mobile-First CSS: Is It Time for a Rethink?", 
		author: "Patrick Clancey",
		url: "https://alistapart.com/article/mobile-first-css-is-it-time-for-a-rethink/"
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
	expect(lastBlog.likes).toBeDefined()
	expect(lastBlog.likes).toEqual(0)
}, 100000)

test('if title or url of a blog are missing we get a 400', async () => {
	const newBlogMissingTitle = {
		author: "Michael Scott",
		url: "https://alistapart.com/article/async-design-critique-giving-feedback/",
		likes: 1000
	}

	await api
		.post('/api/blogs')
		.send(newBlogMissingTitle)
		.expect(400)
	
	const newBlogMissingUrl = {
		title: "This is Michael Scott", 
		author: "Michael Scott",
		likes: 1000
	}

	await api
		.post('/api/blogs')
		.send(newBlogMissingUrl)
		.expect(400)
})

describe('deletion of a blog', () => {
	test('succeds with a status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const titles = blogsAtEnd.map(b => b.title)
		expect(titles).not.toContain(blogToDelete.title)
	})
})

describe('updating the likes of a blog', () => {
	test('succeds with status code 200 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[blogsAtStart.length - 1]
		const newLikes = {
			"likes": 10
		}

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(newLikes)	
			.expect(200)

		const updatedBlog = await api
			.get(`/api/blogs/${blogToUpdate.id}`)
			.expect(200)

		expect(updatedBlog.body.likes).toBe(10)
		expect(updatedBlog.body.title).toContain(blogToUpdate.title)
		expect(updatedBlog.body.author).toContain(blogToUpdate.author)
		expect(updatedBlog.body.url).toContain(blogToUpdate.url)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
		
	})

	test('returns status code 404 if blog does not exist', async () => {
		const validNonexistingId = await helper.nonExistingId()

		await api
			.get(`/api/blogs/${validNonexistingId}`)
			.expect(404)
	})

	test('fails with status code 400 if id is not valid', async() => {
		const invalidId = '5a3d5da59070081a82a3445'
		await api
			.get(`/api/blogs/${invalidId}`)
			.expect(400)
	}, 100000)
})

afterAll(async () => {
	await mongoose.connection.close()
})
	
