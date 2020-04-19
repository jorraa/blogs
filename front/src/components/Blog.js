import React from 'react'

const Blog = ({ blog }) => (
  <div name='shortBlog'>
    {blog.title} {blog.author}
  </div>
)

export default Blog
