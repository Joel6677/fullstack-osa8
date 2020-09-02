import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommended = (props) => {
  const response = useQuery(ME)
  const [getBBG, {data}] = useLazyQuery(BOOKS_BY_GENRE, {fetchPolicy: "no-cache"})
  const [books, setBooks] = useState('')

  useEffect(() => {
    if (response.data) {
      getBBG({variables: {genre: response.data.me.favoriteGenre}})
    }
  }, [response, getBBG])

  useEffect(() => {
    if (data && data.allBooks) {
      setBooks(data.allBooks)
    }
  }, [data, books])

  if (!props.show) {
    return null
  }

  if (response.loading || !response.data) {
    return (
      <div>
        loading...
      </div>
    )
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre {response.data.me.favoriteGenre}:</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended