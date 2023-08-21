import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='blog title'
          />
        </div>
        <div>
          author:
          <input
            id="author"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='blog author'
          />
        </div>
        <div>
          url:
          <input
            id="url"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='blog url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
