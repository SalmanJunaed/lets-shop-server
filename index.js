const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// DB_USER:LetsShop
// DB_PASS:letsshopDB

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const uri = 
`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rw04ymy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// `mongodb+srv://<username>:<password>@cluster0.rw04ymy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect()

        const productCollection = client.db('letsShopDB').collection('products');
        const reviewCollection = client.db('letsShopDB').collection('reviews'); 
        const usersCollection = client.db('letsShopDB').collection('users');

        //All Product API
        //GET All Products 
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })
        //GET single Product by id for Details Page value
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id)}
            // console.log(query);
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        //GET Operation to Count Products
        app.get('/productsCount', async(req, res)=>{
            const count = await productCollection.estimatedDocumentCount()
            res.send({count});
        })
        
        // All Reviews API
        //Get ALL Review
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        // All User API
        //GET All User data 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // POST for a single User Login data  
        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ massage: "user already exist", insertedId: null });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 })
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        )
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("LetsShop Server is Running..")
})

app.listen(port, () => {
    console.log(`LetsShop Running On Port.. ${port}`)
})
