import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import Button from './components/Button'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([]) 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = React.createRef()

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

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .createBlog(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))

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
      window.localStorage.setItem(localStoreKey, JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  const handleLogout = () => {
    localStorage.removeItem(localStoreKey)
    setUser(null)
  }

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
/*
  const blogForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
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
    */



