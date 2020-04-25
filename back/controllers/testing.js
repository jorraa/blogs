const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response) => {
  console.log('testing ...')
  response.json('{Hei me lennetään}')
})

router.post('/reset', async (request, response) => {
  console.log('remove everything from Blog and User')
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router