import React, { useState } from 'react'

const Books = (props) => {

  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }

  let books = props.books
  const tempGenres = books.map(b => b.genres)

  let genresSet = []
  for (let i = 0; i < tempGenres.length; i++) {
    genresSet = genresSet.concat(tempGenres[i])
  }
  genresSet = new Set(genresSet)
  const genres = [...genresSet]

  if (genre !== '') {
    books = books.filter(b => b.genres.includes(genre))
  }

  return (
    <div>
      <h2>books</h2>
      {(genre === ''
        ? <></>
        : <p>in genre <strong>{genre}</strong></p>
      )}
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
      <div>
        {genres.map(g => <button key={g} onClick={() => setGenre(g)}>{g} </button>)
        }
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books