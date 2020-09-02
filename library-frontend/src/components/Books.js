import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/client'
import {ALL_BOOKS} from '../queries'

const Books = (props) => {

  const result = useQuery(ALL_BOOKS)
  const [bookstoShow, setBooksToShow] = useState('')


  useEffect(() => {
    if (result.data && result.allBooks)
    setBooksToShow(result.data.allBooks)
  }, [result])


  if (!props.show || result.loading || !result.data) {
    return null
  }


  return (
    <div>
      <h2>books</h2>

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
          {bookstoShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
