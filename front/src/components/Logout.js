import React from 'react'
import Button from './Button'

const Logout = ({username, handleClick, text}) => {
  if(username){
    return (
    <p>{username } logged in 
      <Button onclick={handleClick} text={text} />
    </p>
    )
  } else return ''
}    
export default Logout