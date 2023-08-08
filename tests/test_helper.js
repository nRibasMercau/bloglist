onst Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title:	"Humility: An Essential Value",
		author:	"Justin Dauer",
		url:	"https://alistapart.com/article/humility-an-essential-value/",
		likes:	100
	},
	{
		title:	"Personalization Pyramid: A Framework for Designing with User Data",
		author:	"Colin Eagan, Jeffrey MacIntyre",
		url:	"https://alistapart.com/article/personalization-pyramid/",
		likes:	140
	},
	{
		title:	"Breaking Out of the Box",
		author:	"Patrick Brosset",
		url:	"https://alistapart.com/article/breaking-out-of-the-box/",
		likes:	10
	},
	{
		title:	"Voice Content and Usability",
		author:	"Preston So",
		url:	"https://alistapart.com/article/voice-content-and-usability/",
		likes:	415
	}
]


const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
	const blog = new Blog({
		title: 'will remove this soon', 
		author: 'will remove this soon', 
		url: 'will remove this soon', 
		likes: 0
	})

	return blog.id.toString()
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


module.exports = {
	initialBlogs, 
    blogsInDb, 
    nonExistingId,
    usersInDb
}
