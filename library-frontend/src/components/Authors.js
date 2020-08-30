import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { EDIT_BORN, ALL_AUTHORS } from '../queries'
import Select from 'react-select'

const Authors = (props) => {

  const result = useQuery(ALL_AUTHORS)
  const [selected, setSelected] = useState('')
  const [born, setBorn] = useState('')
  const [editBorn] = useMutation(
    EDIT_BORN,
    { refetchQueries: [{ query: ALL_AUTHORS }] }
  )

  if (!props.show || result.loading) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    editBorn({ variables: { name: selected.value, setBornTo: born } })
    setBorn('')
    setSelected('')

  }

  const authors = result.data.allAuthors


  const options = authors.map(a => {
    let authorObject = { value: a.name, label: a.name }
    return authorObject
  })


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            name:
            <Select
              value={selected}
              onChange={(selectedOption) => {
                setSelected(selectedOption)
              }}
              options={options}
            />
          </div>
          <div>
            born:
            <input
              value={born}
              onChange={({ target }) => setBorn(Number(target.value))}
            />
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>

    </div>
  )
}

export default Authors
