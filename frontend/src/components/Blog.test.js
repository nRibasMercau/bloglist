import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'A blog article test', 
  author: 'Kentouchovsky', 
  url: 'ablogarticletest', 
  likes: 3,
  user: 'Administrator' 
}

const handleLike = () => {
  console.log('like +1')
}

const handleRemove = () => {
  console.log('removed')
}

test('blog shows title and author, but not additional information', () => {

  const { container } = render(<Blog blog={blog} handleLike={handleLike} handleRemove={handleRemove} />)
  //const div = container.querySelector('.blog')

  const b = container.querySelector('.blog')
  //console.log(screen.getByTestId('blog'))
  expect(b).toHaveTextContent(`${blog.title} by ${blog.author}`)
  expect(b).not.toHaveTextContent('likes')
  expect(b).not.toHaveTextContent('Administrator')

})


test('clicking the show button renders the rest of the blog information', async () => {  
 
  const mockHandler = jest.fn()
  
  const { container } = render(<Blog blog={blog} handleLike={handleLike} handleRemove={handleRemove} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const b = container.querySelector('.blogDetail')
  expect(b).toHaveTextContent('likes')
  expect(b).toHaveTextContent('ablogarticletest')
})


test('clicking the button like twice calls the event handler twice', async () => {
  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} handleRemove={handleRemove} />)
  
  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})


