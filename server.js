
const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://trung:Abcd1234@cluster0.dqhl5ao.mongodb.net/?retryWrites=true&w=majority'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        const db = client.db('ATN')
        const productCollection = db.collection('Products')
        
        app.set('view engine', 'ejs') 
        
        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(express.static('public'))

      
        app.use(bodyParser.json())

     
        app.get('/', (req, res) => {
            db.collection('Products').find().toArray()
                .then(results => {

                    console.log(results)
                    
                    res.render('index.ejs', { products: results })
                })
                .catch(error => console.error(error))
        })

        app.post('/add', (req, res) => {
            productCollection.insertOne(req.body)
            .then(result => {
                
                console.log(result)

                res.redirect('/')
             })
            .catch(error => console.error(error))
        })


        app.get("/insert", function (req, res) {
            res.render('insert.ejs');
        });


        app.get("/return", function (req, res) {
            res.redirect('/');
        });


        app.post('/search', (req, res) => {
            db.collection('Products').find(req.body).toArray()
            .then(result => {
                
                console.log(result)

                res.render('search.ejs', { products: result })
             })
            .catch(error => console.error(error))
        })

        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })
