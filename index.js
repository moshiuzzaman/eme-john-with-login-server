const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = 4000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ki0s6.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(cors())
app.use(bodyParser.json())




client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_PASS}`).collection("products");
  const shipmentCollection = client.db(`${process.env.DB_PASS}`).collection("shipment");
   app.post('/addProducts',(req, res) => {
     productsCollection.insertMany(req.body)
     .then(data =>console.log(data))
   })
   app.get('/products',(req, res) => {
     productsCollection.find({})
     .toArray((err, data) =>{
       res.send(data)
     })
   })
   app.get('/product/:key',(req, res) => {
     productsCollection.find({key: req.params.key})
     .toArray((err, result) => {
       res.send(result[0])
     })
   })
   app.post('/productsByKeys',(req, res) => {
     const productKeys =req.body
     productsCollection.find({key:{$in: productKeys}})
     .toArray((err, result) => {
       res.send(result)
     })
   })
   app.post('/shipment',(req, res) => {
     shipmentCollection.insertOne(req.body)
     .then(data=>
      console.log(data))
   })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`${port} port is running`)
})