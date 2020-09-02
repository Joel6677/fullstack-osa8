import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setPage, show }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [login, result] = useMutation(LOGIN, 
    {
      onError: (error) => {
        setError('Wrong username or password')
      }
    })

  useEffect(() => {
    if (result.data) {
      console.log('-->', result.data)
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    login({
       variables: { username, password}
      })
    
    setPage('authors')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username:
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password:
          <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
      <div>
        {error}
      </div>
    </div>
  )
}

export default LoginForm
