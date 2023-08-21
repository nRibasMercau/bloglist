import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [showDetail, setShowDetail] = useState(false)
  /*
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  */

  const buttonLabel = showDetail ? 'hide' : 'show'

  const toggleVisibility = () => {
    setShowDetail(!showDetail)
  }

  const updateBlog = async () => {
    const updatedBlog = { ...blog }
    updatedBlog.likes = blog.likes + 1
    await handleLike(updatedBlog)
  }

  const removeBlog = async () => {
    await handleRemove(blog.id)
  }

  const blogDetail = () => {
    return (
      <div className="blogDetail">
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={updateBlog}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    )
  }

  const removeButton = () => {
    return (
      <div><button onClick={removeBlog}>Remove</button></div>
    )
  }

  return (
    <div className="blog">
      {blog.title} by {blog.author} <button onClick={toggleVisibility}>{buttonLabel}</button>
      {showDetail && blogDetail()}
      {JSON.parse(window.localStorage.getItem('loggedUser')).username === blog.user.username && removeButton()}
    </div>
  )
}

export default Blog
