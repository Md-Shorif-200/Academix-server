const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middlewares 
app.use(express.json())
app.use(cors())





// !mongodb database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.56yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    // !database collection
    const userCollection = client.db('academixDb').collection('Users');
    const teacherCollection = client.db('academixDb').collection('Teachers');
   




    // ! user related  Api

    app.post('/users' , async(req,res) => {
          const user = req.body;
          // if user already sign up
          const query = {email : user.email};
          const userAlradyExist = await userCollection.findOne(query);
          if(userAlradyExist){
            return  res.send({meassage : 'u are already sign up. please sign in', insertedId : null});
          }

          const  result =  await userCollection.insertOne(user);
          res.send(result)
    })

    app.get('/users', async(req,res) => {
         const result = await userCollection.find().toArray();
         res.send(result)
    })

    // update user role

    app.patch('/users/admin/:id', async(req,res) => {
       const id = req.params.id;
       const filter = {_id : new ObjectId(id)};
       const updatedDoc = {
         $set : {
          role : 'admin'
         }
       }
       const result = await userCollection.updateOne(filter,updatedDoc);
       res.send(result)

    })
    // ! teacher related api

    app.post('/teachers', async(req,res) => {
       const teacher  = req.body;
       const result = await teacherCollection.insertOne(teacher);
       res.send(result)
    })

    app.get('/teachers', async(req,res) => {
      const result = await teacherCollection.find().toArray();
      res.send(result)
    })




    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res) => {
    res.send('academix server is running')
})

app.listen(port, () => {
     console.log('academix server is running on port', port);
     
})