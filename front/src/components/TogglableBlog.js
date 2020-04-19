import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const TogglableBlog = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blog = props.blog
  const showRemove = props.username === blog.user.username
    ?{ display: visible ? '' : 'none' }
    :{ display: visible ? 'none' : '' }

  const onRemoveClick = () => {
    // eslint-disable-next-line no-restricted-globals
    const ok = confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if(ok) {
      props.onRemove(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="defaultContent">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}> view </button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button><br></br>
        {blog.url} <br></br>
        likes: {blog.likes}
        <button id={blog.id} onClick={props.onLikesClick}>
            Like
        </button><br></br>
        {blog.user.name}<br></br>
        <button id={blog.id} onClick={onRemoveClick} style={showRemove}>remove</button>
      </div>
    </div>
  )
})

TogglableBlog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  onLikesClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}
export default TogglableBlog