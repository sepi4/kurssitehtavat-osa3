const express = require('express')

const app = express()

app.use(express.static('build'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')

// app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body),
  ].join(' ')
}))

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

app.get('/', (req, res) => {
  res.send(`<p>moikka</p>
  <p>json-data on osoitteessa '.../api/persons'</p>`)
})



app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has of for ${notes.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({ error: "no name"})
  }
  if (!body.number) {
    return res.status(400).json({ error: "no number"})
  }
  if (persons.find(p => p.name === body.name) !== undefined) {
    return res.status(400).json({ error: "name is not unique"})
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.random()
  }
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)
