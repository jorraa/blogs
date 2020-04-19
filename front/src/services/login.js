import axios from 'axios'
const baseUrl = '/api/login'

const doLogin = (username, password) => {
  const request = axios
    .post(baseUrl, { username: username, password: password })

  return request.then(response => response.data)
}

const getLoggedUser = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
export default { doLogin, getLoggedUser }