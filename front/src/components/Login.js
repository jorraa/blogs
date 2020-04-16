import React from 'react'
const Login = (props) => (
  <>
    <form onSubmit={props.doLogin}>
      <div>
        username: <input name='username'/>
      </div>
      <div>password: <input name='password' type='password'/>
      </div>
      <div>
        <button type="submit">login</button>
      </div>
    </form>
  </>
)

export default Login