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
      likes: newLikes
    }
  
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewAuthor('')
        setNewTitle('')
        setNewUrl('')
        setNewLikes(0)
      })
  }

  /*
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)   
      })
  }
*/
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
      setErrorMessage('wrong credentials')
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
      Title: <input
        value={newTitle}
        onChange={handleTitleChange}
      />
      Author: <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />
        Url: <input
        value={newUrl}
        onChange={handleUrlChange}
      />
      Title: <input
        value={newLikes}
        onChange={handleLikesChange}
      />

      <button type="submit">save</button>
    </form>  
  )
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in 
            <Button handleClick={handleLogout} text='logout' />
          </p>  
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
import React, { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'


const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  }
  
//My old ones
  const doLogin = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    
    loginService.doLogin(username, password)
      .then(user => {
        setUser(user)
        console.log('user, afterlogin', user)
        localStorage.username = user.username
      })
    console.log('asetettu local, userId ', localStorage.username) 
    console.log('aset. user', user) 
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  const doLogout = () => {
    setUser(null)
    localStorage.removeItem('username')
  }
  
  console.log('local.username', localStorage.username)
  if(user === null && localStorage.username !== null) {
      userService.getByUsername(localStorage.username)
      .then(resp => {
        console.log('resp', user)
        setUser(resp)
      }
      )
  }
  console.log('userBef UI', user)
  if(user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Login doLogin={doLogin} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Logout username={ user.username } onclick={doLogout} text='logout' />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      
    </div>
  )
}

export default App
*/