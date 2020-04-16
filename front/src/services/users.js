import axios from 'axios'
const baseUrl = '/api/users'

const getUser = (userId) => {
  if( userId === null) { return null }
console.log('userdId ohi iffin', userId)  
  const request = axios.get(`${baseUrl}/${userId}`)
  return request
    .then(response => response.data)
    .catch(error => error.response.data)
}

export default { getUser }