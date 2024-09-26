import React, { useState } from 'react'


const NewBlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewBlog({
      ...newBlog, [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>title:</label>
          <input 
          data-testid='title'
          type="text" 
          name="title" 
          value={newBlog.title} 
          onChange={handleChange} 
          placeholder='title'/>
        </div>
        <div>
          <label>author:</label>
          <input
          data-testid='author' 
          type="text" 
          name="author"  
          value={newBlog.author} 
          onChange={handleChange} 
          placeholder='author'/>
        </div>
        <div>
          <label>url:</label>
          <input 
          data-testid='url'
          type="text" 
          name="url" 
          value={newBlog.url} 
          onChange={handleChange} 
          placeholder='url'/>
        </div>

        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default NewBlogForm