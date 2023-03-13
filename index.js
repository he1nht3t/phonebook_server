const express = require('express');
const app = express();

app.use(express.static('dist'));

//CORS
const cors = require('cors');
app.use(cors());

//json-parser middleware
app.use(express.json());

//morgan middleware
const morgan = require('morgan')

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} peoeple \n ${new Date()}`);
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id);

    if(person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id);

    if(person) {
        persons = persons.filter(person => person.id !== id)
        return res.status(204).end()
    } else {
        res.status(404).end();
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name) {
        return res.status(400).json({message: 'Name is required'})
    }

    if(!body.number) {
        return res.status(400).json({message: 'Number is required'})
    }

    const isNameExist = persons.some(person => person.name === body.name);

    const isNumberExist = persons.some(person => person.number === body.number);

    if(isNameExist) {
        return res.status(422).json({message: "Name must be unique"})
    }

    if(isNumberExist) {
        return res.status(422).json({message: "Number already exist"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomIntInclusive(1, 1000)
    }

    persons = persons.concat(person);

    res.status(201).json(person);

})

//unknown endpoint middleware
const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'Unknown endpoint'});
}
app.use(unknownEndpoint);


const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})