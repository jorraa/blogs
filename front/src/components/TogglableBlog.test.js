import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import TogglableBlog from './TogglableBlog'


describe('<TogglableBlog />', () => {
  let component

  beforeEach(() => {
    const user = {
      username: 'jorraa',
      name: 'Jorma Raatikainen'
    }
    const blog = {
      title: 'Fiini blogi',
      author: 'Ville Fiini',
      url:'http://jorma.com',
      likes: 23,
      user: user
    }

    component = render(
      <TogglableBlog
        blog = {blog}
        username = 'jorraa'
        onLikesClick = { jest.fn() }
        onRemove = { jest.fn() }
      >
        <div className="testDiv" />
      </TogglableBlog>
    )
  })

  test('renders its children', () => {
    expect(
      component.container.querySelector('.testDiv')
    ).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('in default view title and author exist & url and likes not', () => {
    const div = component.container.querySelector('.defaultContent')
    expect(div).toHaveTextContent('Fiini blogi')
    expect(div).toHaveTextContent('Ville Fiini')

    expect(div).not.toHaveTextContent('http://jorma.com')
    expect(div).not.toHaveTextContent('likes')
  })

  test('after clicking the button, also url and likes are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveTextContent('Fiini blogi')
    expect(div).toHaveTextContent('Ville Fiini')
    expect(div).toHaveTextContent('http://jorma.com')
    expect(div).toHaveTextContent('likes: 23')
  })
})

describe('<TogglableBlog />, mock onClick', () => {
  test('clicking like button twice, likes update is called twice', () => {
    const user = {
      username: 'jorraa',
      name: 'Jorma Raatikainen'
    }
    const blog = {
      title: 'Fiini blogi',
      author: 'Ville Fiini',
      url:'http://jorma.com',
      likes: 23,
      user: user
    }

    const mockHandler = jest.fn()

    const component = render(
      <TogglableBlog
        blog = {blog}
        username = 'jorraa'
        onLikesClick = { mockHandler }
        onRemove = { jest.fn() }
      />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('Like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
