require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))

const Person = require('./models/person')

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
  // res.json(persons)
  Person.find({})
    .then(persons => {
      res.json(persons.map(p => p.toJSON()))
      // res.json(persons)
    })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has of for ${persons.length} people</p>
      <p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findByIdAndUpdate(id, newPerson, {new:true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)
