// import React, { useState, useEffect } from 'react'
// import Authors from './components/Authors'
// import Books from './components/Books'
// import NewBook from './components/NewBook'
// import { useQuery, useApolloClient } from '@apollo/client'
// import LoginForm from './components/LoginForm'
// import { ALL_AUTHORS, ALL_BOOKS, ME } from './queries'

// const Notify = ({ errorMessage }) => {
//   if ( !errorMessage ) {
//     return null
//   }

//   return (
//     <div style={{color: 'red'}}>
//       {errorMessage}
//     </div>
//   )
// }

// const App = () => {
//   const [page, setPage] = useState('authors')
//   const [token, setToken] = useState(null)
//   const [errorMessage, setErrorMessage] = useState(null)
//   const client = useApolloClient()

//   useEffect(() => {
//     const token = localStorage.getItem('library-user-token')
//     if ( token ) {
//       setToken(token)
//     }
//   },[])
  
//   const logout = () => {
//     setToken(null)
//     localStorage.clear()
//     client.resetStore()
//   }

//   if (!token) {
//     return (
//       <div>
//         <div>
//           <button onClick={() => setPage('authors')}>authors</button>
//           <button onClick={() => setPage('books')}>books</button>
//           <button onClick={() => setPage('login')}>login</button>
//         </div>

//         <Authors
//           show={page === 'authors'}
//         />

//         <Books
//           show={page === 'books'}
//         />

//         <NewBook
//           show={page === 'add'}
//         />

//         <LoginForm
//           show={page === 'login'}
//           setToken={setToken}
//           setPage={setPage}
//         />
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div>
//         <button onClick={() => setPage('authors')}>authors</button>
//         <button onClick={() => setPage('books')}>books</button>
//         <button onClick={() => setPage('add')}>add book</button>
//         <button onClick={logout}>logout</button>
//       </div>

//       <Authors
//         show={page === 'authors'}
//         token={token}
//       />

//       <Books
//         show={page === 'books'}
//       />

//       <NewBook
//         show={page === 'add'}
//       />

//     </div>
//   )
// }

// export default App

import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const t = localStorage.getItem('gql-lib-utoken')
    console.log(t)
    if (t !== null || t !== undefined) setToken(t)
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded
      window.alert(
        `A book was added:
          ${book.title}
          by: ${book.author.name}`
        )
    }
  })

  const logout = () => {
    localStorage.removeItem('gql-lib-utoken')
    setToken(null)
    setPage('login')
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        
        <Authors
        show={page === 'authors'}
        />

        <Books
        show={page === 'books'}
        />

        <NewBook
        show={page === 'add'}
        />

        <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        />
      </div>
    )
  }
 
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={() => logout()}>logout</button>
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Recommended
        show={page === 'recommended'}  
      />
    </div>
  )
}

export default App