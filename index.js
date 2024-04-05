const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgznyse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const usersCollection = client.db("cattleFarmDB").collection('users')
        const cowCollection = client.db("cattleFarmDB").collection('cow')
        const goatCollection = client.db("cattleFarmDB").collection('goat')
        const shopCollection = client.db("cattleFarmDB").collection('shop')
        const cartCollection = client.db("cattleFarmDB").collection('cart')
        const reviewCollection = client.db("cattleFarmDB").collection('review')
        const bookingCollection = client.db("cattleFarmDB").collection('booking')


        // post method for user
        app.post('/user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exist', insertedId: null })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // post method for booking
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        // post method for shop
        app.post('/cart', async (req, res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        })

        // get method for user
        app.get('/user', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        // get method for Admin
        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin';
            }
            res.send({ admin });
        })

        // get method for cow
        app.get('/cow', async (req, res) => {
            const result = await cowCollection.find().toArray();
            res.send(result);
        })

        // get method for goat
        app.get('/goat', async (req, res) => {
            const result = await goatCollection.find().toArray();
            res.send(result);
        })

        // get method for shop
        app.get('/shop', async (req, res) => {
            const result = await shopCollection.find().toArray();
            res.send(result);
        })

        // get method for booking
        app.get('/booking', async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result);
        })

        // get method for booking
        app.get('/cart', async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result);
        })

        // stats or analytics
        app.get('/admin-stats', async (req, res) => {
            const user = await usersCollection.estimatedDocumentCount();
            const booking = await bookingCollection.estimatedDocumentCount();
            const cow = await cowCollection.estimatedDocumentCount();
            const goat = await goatCollection.estimatedDocumentCount();
            const review = await reviewCollection.estimatedDocumentCount();

            res.send({
                user,
                booking,
                cow,
                goat,
                review,
            })
        })

        // patch method for user to make admin
        app.patch('/user/admin/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        // delete method for user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        // delete method for booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is Ready !')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})