const mongoose = require('mongoose');

if(process.argv < 3) {
    console.log('give password [name] [number] as arguments ')
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb://fullstack:${password}@ac-z2xr5ah-shard-00-00.issccat.mongodb.net:27017,ac-z2xr5ah-shard-00-01.issccat.mongodb.net:27017,ac-z2xr5ah-shard-00-02.issccat.mongodb.net:27017/phonebook-app?ssl=true&replicaSet=atlas-4jc2ly-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongodb')
    })
    .catch(err => {
        console.log(err.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date
})

const Person = mongoose.model('Person', personSchema)

if(name && number) {
    const person = new Person({
        name: name,
        number: number,
        date: new Date()
    })

    person.save()
      .then(result => {
            console.log(`added ${name} number ${number} to phonebook`);
          mongoose.connection.close()
        })
      .catch(err => {
            console.log(err.message)
        })
} else {
    Person.find({})
        .then(persons => {
            console.log('phonebook: ');
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
}
