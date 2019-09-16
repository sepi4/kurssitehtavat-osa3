const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(`<p>moikka</p>
  <p>json-data on osoitteessa '.../api/persons'</p>`)
})

let persons = [
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

app.get('/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
