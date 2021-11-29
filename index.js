const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongoDb').ObjectId;
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgvb4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db("ChillTour");
        const packageCollection = database.collection("packages");
        const orderCollection = database.collection("orders")

        //  PACKAGE GET API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
        //  PACKAGE POST API
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const package = await packageCollection.insertOne(newPackage)
            res.json(package)

        })
        // DYNAMIC API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await packageCollection.findOne(query);
            res.send(package);
        })
        // order GET API 
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        // Order POST API 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const orders = await orderCollection.insertOne(order);
            res.json(orders)
        })
        // Delete API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result);
        })
        // USE Post to get data by keys 
        app.post('/packages/name', async (req, res) => {
            const package = req.body;
            const query = { name: { $in: package } }
            const packages = await packageCollection.find(query).toArray();
            res.json(packages)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Chill World')
})
app.get('/hello', (req, res) => {
    res.send('Welcome ')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})