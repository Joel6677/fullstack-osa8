import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import LoginForm from './components/LoginForm'
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import Recommended from './components/Recommended'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const result = useQuery(ALL_BOOKS)

  // const updateCacheWith = (addedBook) => {
  //   const includedIn = (set, object) => 
  //     set.map(p => p.id).includes(object.id)  

  //   const dataInStore = client.readQuery({ query: ALL_BOOKS })
  //   if (!includedIn(dataInStore.allBooks, addedBook)) {
  //     client.writeQuery({
  //       query: ALL_BOOKS,
  //       data: { allBooks : dataInStore.allBooks.concat(addedBook) }
  //     })
  //   }   
  // }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(
        `Added a book:
          ${addedBook.title}
          by: ${addedBook.author.name}`
        )
        // updateCacheWith(addedBook)
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if ( token ) {
      setToken(token)
    }
  },[])

  if (result.loading)  {
    return <div>loading...</div>
  }
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
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
          books={result.data.allBooks}
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
        <button onClick={logout}>logout</button>
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={result.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
        // updateCacheWith = {updateCacheWith}
      />

      <Recommended
        show={page === 'recommended'}
      />

    </div>
  )
}

export default App
