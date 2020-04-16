import React, { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  console.log("Effect used")
  
  const doLogin = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    
    loginService.doLogin(username, password)
      .then(user => {
        setUser(user)
        console.log('user, afterlogin', user)
        localStorage.userId = user.id.toString()
      })
    console.log('asetettu local, userId ', localStorage.userId) 
    console.log('aset. user', user) 
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  const doLogout = () => {
    setUser(null)
    localStorage.removeItem('userId')
  }
  
  console.log('local.userId', localStorage.userId)
  if(!user && !localStorage.userId === null) {
    setUser(userService.getUser(localStorage.userId))
  }
  console.log('user', user)
  if(!user && !errorMessage) {
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
/*
if(!username || username.length === 0){
      console.log('errMsg')
      setErrorMessage('username needed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
    if(!password || password.length === 0){
      setErrorMessage('password needed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
*/