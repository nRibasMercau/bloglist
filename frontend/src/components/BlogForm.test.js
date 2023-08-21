import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {

  const createBlog = jest.fn()
  const user = userEvent.setup()
  
  render(<BlogForm createBlog={createBlog} />)
 
  const titleInput = screen.getByPlaceholderText('blog title')
  const authorInput = screen.getByPlaceholderText('blog author')
  const urlInput = screen.getByPlaceholderText('blog url')

  const sendButton = screen.getByText('create')
  
  await user.type(titleInput, 'a blog title')
  await user.type(authorInput, 'a blog author')
  await user.type(urlInput, 'a blog url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('a blog title')
  expect(createBlog.mock.calls[0][0].author).toBe('a blog author')
  expect(createBlog.mock.calls[0][0].url).toBe('a blog url')
  
})
