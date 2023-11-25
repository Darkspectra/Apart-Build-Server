const express = require('express');
const app = express();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config()
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bezlu4y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const roomCollection = client.db("buildDB").collection("rooms");
    const userCollection = client.db("buildDB").collection("users");
    const agreementCollection = client.db("buildDB").collection("agreement");
    const announcementCollection = client.db("buildDB").collection("announcement");
    const paymentCollection = client.db("buildDB").collection("payments");


    app.get('/rooms', async (req, res) => {
        const result = await roomCollection.find().toArray();
        res.send(result);
      });


    app.get('/users', async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
      });

    app.get("/users/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })  

    app.get("/agreement/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await agreementCollection.findOne(query);
      res.send(result);
    })  


    app.get('/agreement', async (req, res) => {
        const result = await agreementCollection.find().toArray();
        res.send(result);
      });


    app.get('/announcement', async (req, res) => {
        const result = await announcementCollection.find().toArray();
        res.send(result);
      });


    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });


    app.post('/agreement', async (req, res) => {
        const agreementItem = req.body;
        const result = await agreementCollection.insertOne(agreementItem);
        res.send(result);
      });

    app.post('/announcement', async (req, res) => {
        const announcementItem = req.body;
        const result = await announcementCollection.insertOne(announcementItem);
        res.send(result);
      });

    app.post('/makePayment', async (req, res) => {
        const PaymentItem = req.body;
        const result = await paymentCollection.insertOne(PaymentItem);
        res.send(result);
      });



      app.put("/users/:id", async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert:true};
        const updatedRole = req.body;
        const role = {
          $set: {
            role: updatedRole.role
          }
        }
        const result = await userCollection.updateOne(filter, role, options);
        res.send(result);
      })

      app.put("/agreement/:id", async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert:true};
        const updatedStatus = req.body;
        const role = {
          $set: {
            status: updatedStatus.status
          }
        }
        const result = await agreementCollection.updateOne(filter, role, options);
        res.send(result);
      })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
  })
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
