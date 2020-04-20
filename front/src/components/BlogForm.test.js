import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'


test('title, author and url have corect values when create is clicked', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Hieno blogi' }
  })
  fireEvent.change(author, {
    target: { value: 'Ville Fiini' }
  })
  fireEvent.change(url, {
    target: { value: 'http://villefiini.com' }
  })

  fireEvent.submit(form)
  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('Hieno blogi' )
  expect(createBlog.mock.calls[0][0].author).toBe('Ville Fiini' )
  expect(createBlog.mock.calls[0][0].url).toBe('http://villefiini.com' )
})

