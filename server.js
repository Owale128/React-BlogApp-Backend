const express = require("express");
const { MongoClient} = require("mongodb");
const app = express();
const port = 3000;
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.get('/api/blogPosts', async (req, res) => {
    try {
      await client.connect();
      const collection = client.db("Blog").collection("BlogPosts");
      const blogPosts = await collection.find({}).toArray();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await client.close();
    }
  });
  


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });