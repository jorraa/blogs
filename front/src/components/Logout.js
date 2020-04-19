import React from 'react'
import Button from './Button'

const Logout = ({ username, handleLogoutClick, text }) => {
  console.log('Logout username', username)
  if(username){
    return (
      <p>{username } logged in
        <Button onclick={handleLogoutClick} text={text} />
      </p>
    )
  } else return '<p>No user</p>'
}

export default Logout