import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import Notification from './components/Notification'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([]) 
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('0')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
    
  const localStoreKey = 'loggedBlogappUser'

  useEffect(() => {
    blogService
      .getAll()
      .then(initialNotes => {
        setBlogs(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStoreKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    }
  
    blogService
      .createBlog(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewAuthor('')
        setNewTitle('')
        setNewUrl('')
        setNewLikes(0)
        setInfoMessage(`a new blog ${returnedBlog.title} by ${user.name} added `)
        setTimeout(() => {
          setInfoMessage(null)
        }, 3000)
      })
  }
 
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.doLogin(
        username, password
      )
      setUser(user)
      window.localStorage.setItem(localStoreKey, JSON.stringify(user)
      ) 
      blogService.setToken(user.token)

      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }
  const handleLikesChange = (event) => {
    setNewLikes(event.target.value)
  }

  const handleLogout = () => {
    localStorage.removeItem(localStoreKey)
    setUser(null)
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <p> 
        Title: <input
        value={newTitle}
        onChange={handleTitleChange}
        />
      </p>
      <p>
        Author: <input
          value={newAuthor}
          onChange={handleAuthorChange}
        />
      </p>
      <p>
        Url: <input
        value={newUrl}
        onChange={handleUrlChange}
        />
      </p>
      <button type="submit">create</button>
    </form>  
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} className='error'/>
      <Notification message={infoMessage} className='info'/>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in 
            <Button handleClick={handleLogout} text='logout' />
          </p>  
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
      <Footer />
    </div>
  )
}

export default App 