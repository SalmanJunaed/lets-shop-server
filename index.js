const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// DB_USER:LetsShop
// DB_PASS:letsshopDB

const { MongoClient, ServerApiVersion } = require("mongodb")
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


        const reviewCollection = client.db('letsShopDB').collection('reviews');
        const productCollection = client.db('letsShopDB').collection('products');

        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

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
