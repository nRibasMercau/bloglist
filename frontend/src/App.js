import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, type: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password, })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'login succesful', type: 'info' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'wrong credentials', type: 'error' })
      /*setNotificationType('error')
      setNotificationMessage('wrong credentials')*/
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    )
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setNotification({ message: 'logged out', type: 'info' })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    blogService
      .createNew(blogObject)
      .then(savedBlog => {
        blogFormRef.current.toggleVisibility()
        setBlogs(blogs.concat(savedBlog))
        setNotification({ message: `new blog ${savedBlog.title} by ${savedBlog.author} added`, type: 'info' })
        setTimeout(() => {setNotification({ message: null, type: null })}, 5000)
      })
      .catch(exception => {
        setNotification({ message: `error creating new blog ${exception}`, type: 'error' })
        setTimeout(() => {setNotification({ message: null, type: null })}, 5000)
      })
  }

  const handleLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      const newBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      setBlogs(newBlogs)
      setNotification({ message: 'blog updated', type: 'info' })
      setTimeout(() => {setNotification({ message: null, type: null })}, 5000)
    } catch (exception) {
      setNotification({ message: `error updating blog: ${exception}`, type: 'error' })
      setTimeout(() => {setNotification({ message: null, type: null })}, 5000)
    }
  }

  const handleRemove = async (blogId) => {
    try {
      await blogService.remove(blogId)
      setNotification({ message: 'blog removed', type: 'info' })
      setTimeout(() => {setNotification({ message: null, type: null })}, 5000)
      const updatedBlogList = await blogService.getAll()
      setBlogs(updatedBlogList)
    } catch (exception) {
      setNotification({ message: `error removing blog: ${exception}`, type: 'error' })
      setTimeout(() => {setNotification({ message: null, type: null })}, 5000)
    }
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel='new blog' hideButtonLabel='cancel' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  const compareFn = (blog1, blog2) => {
    return blog2.likes - blog1.likes
  }

  if (user === null) {
    return (
      <div id="loginForm">
        <h2>Log in to the application</h2>
        <Notification message={notification.message} type={notification.type} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification.message} type={notification.type} />

      <div className='loggedUserInfo'>
        {user.name} logged in
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="blogForm">
        {blogForm()}
      </div>

      <div className="blogList">
        {blogs
          /*.filter(blog => blog.user.username === user.username)*/
          .sort(compareFn)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          )
        }
      </div>
    </div>
  )
}

export default App
