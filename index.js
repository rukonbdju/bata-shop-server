const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;
const app = express();

const ObjectId = require('mongodb').ObjectId;

//middlewares
app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${user}:${password}@bata-cluster.aftrqal.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const database = client.db("bata-shop");
        const productcollection = database.collection("products");
        // get all products
        app.get('/products', async(req,res)=> {
            const quary = {};
            const cursor = productcollection.find(quary);
            const products = await cursor.toArray();
            res.send(products);
        })

        //document count
        app.get('/count',async(req,res)=>{
            const productCount=await productcollection.estimatedDocumentCount();
            let count={
                productCount:productCount
            }
            res.send(count)
        })
        //get only men categorygit 
        app.get('/men', async(req,res)=> {
            const quary = {category:"men"};
            const cursor = productcollection.find(quary);
            const products = await cursor.toArray();
            res.send(products);
        })
        app.get('/women', async(req,res)=> {
            const quary = {category:"women"};
            const cursor = productcollection.find(quary);
            const products = await cursor.toArray();
            res.send(products);
        })
        app.get('/kids', async(req,res)=> {
            const quary = {category:"kid"};
            const cursor = productcollection.find(quary);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async(req, res) => {
            const productId = req.params.id;
            const quary= ObjectId(productId);
            console.log(productId);
            const product = await productcollection.findOne(quary);
            if (!product) {
              return res.status(404).send('Product not found');
            }
            res.send(product);
          });

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);




//cheak connection errors

app.get('/', (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log("running the node server")
})