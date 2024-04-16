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

        const usersCollection = client.db("cattleFarmDB").collection('users');
        const cattleCollection = client.db("cattleFarmDB").collection('cattle');
        const shopCollection = client.db("cattleFarmDB").collection('shop');
        const cartCollection = client.db("cattleFarmDB").collection('cart');
        const reviewCollection = client.db("cattleFarmDB").collection('review');
        const bookingCollection = client.db("cattleFarmDB").collection('booking');
        const blogCollection = client.db("cattleFarmDB").collection('blog');


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

        // post method for cattle
        app.post('/cattle', async (req, res) => {
            const cattle = req.body;
            const result = await cattleCollection.insertOne(cattle);
            res.send(result);
        })

        // post method for shop
        app.post('/shop', async (req, res) => {
            const shop = req.body;
            const result = await shopCollection.insertOne(shop);
            res.send(result);
        })

        // post method for cart
        app.post('/cart', async (req, res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        })

        // post method for review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        // post method for review
        app.post('/blog', async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
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

        // get method for cattle
        app.get('/cattle', async (req, res) => {
            const result = await cattleCollection.find().toArray();
            res.send(result);
        })

        // get method for cattle
        app.get('/cattle/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cattleCollection.findOne(query);
            res.send(result)
        })

        // get method for shop
        app.get('/shop', async (req, res) => {
            const result = await shopCollection.find().toArray();
            res.send(result);
        })

        // get method for booking
        app.get('/booking', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        // get method for booking
        app.get('/admin/booking', async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result);
        })

        // get method for cart
        app.get('/cart', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        // get method for all cart
        app.get('/admin/cart', async (req, res) => {
            const allItems = await cartCollection.find().toArray();
            res.send(allItems);
        });


        // get method for review
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        // get method for blog
        app.get('/blog', async (req, res) => {
            const result = await blogCollection.find().toArray();
            res.send(result);
        })

        // stats or analytics
        app.get('/admin-stats', async (req, res) => {
            const user = await usersCollection.estimatedDocumentCount();
            const booking = await bookingCollection.estimatedDocumentCount();
            const cattle = await cattleCollection.estimatedDocumentCount();
            const cart = await cartCollection.estimatedDocumentCount();
            const review = await reviewCollection.estimatedDocumentCount();

            res.send({
                user,
                booking,
                cattle,
                cart,
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

        // patch method for cattle
        app.patch('/cattle/:id', async (req, res) => {
            const cattle = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    origin: cattle.origin,
                    category: cattle.category,
                    price: cattle.price,
                    weight: cattle.weight,
                    age: cattle.age,
                    image: cattle.image
                }
            }

            const result = await cattleCollection.updateOne(filter, updatedDoc)
            res.send(result);
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