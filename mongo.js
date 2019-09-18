const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sepi4:${password}@cluster0-aw8ny.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person
    .find({})
    .then(result => {
      // console.log(result)
      console.log('phonebook:')
      result.forEach(person => {
        // console.log(`${person.name} ${person.number}`)
        console.log(person.toJSON())
      })
      mongoose.connection.close()
    })
}
else {
  const name = process.argv[3]
  const number = process.argv[4]

  if (!name || !number) {
    console.log('need name and number')
    process.exit(1)
  }


  const person = new Person({
    name: name,
    number: number,
    id: Math.random(),
  })

  person.save().then(res => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

