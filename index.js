const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(`<p>moikka</p>
  <p>json-data on osoitteessa '.../api/persons'</p>`)
})

let notes = [
  {
    name: "kissa",
    number: "111",
    id: 1,
  },
  {
    name: "koira",
    number: "222",
    id: 2,
  },
  {
    name: "apina",
    number: "333",
    id: 3,
  },
  {
    name: "sika",
    number: "444",
    id: 4,
  },
  {
    name: "hevonen",
    number: "555",
    id: 5,
  },
]


app.get('/api/persons', (req, res) => {
  res.json(notes)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has of for ${notes.length} people</p>
    <p>${new Date()}</p>`)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
