import React from 'react'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Blogs app by JR, Fullstackopen in University of Helsinki 2020</em>
    </div>
  )
}

export default Footer