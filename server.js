const express = require("express");
const cors = require("cors")
const { MongoClient, ObjectId} = require("mongodb");
const app = express();
const port = 3000;
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());


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
  

app.post('/api/blogPost', async (req,res)=>{
try {
  await client.connect();
  const collection = client.db('Blog').collection('BlogPosts');
  const newBlogPost = req.body;
  const result = await collection.insertOne(newBlogPost);
  const insertedPost = await collection.findOne({ _id: result.insertedId });
  res.status(201).json({ message: "Blog post successfully added!", post: insertedPost });
}catch (error) {
  console.error("Error creating blog post:", error);
res.status(500).json({ error: "Internal Server Error"});
} finally {
  await client.close();
}
});


app.put('/api/blogPost/:id', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('Blog').collection('BlogPosts');
    const postId = req.params.id;
    const updatedPost = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updatedPost }
    );
    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "Blog post not found" });
    } else {
      res.status(200).json({ message: "Blog post successfully updated!" });
    }
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});


app.delete('/api/blogPost/:id', async(req, res) =>{
  
  try {
    await client.connect();
    const collection = client.db('Blog').collection('BlogPosts');
    const postId = req.params.id;
    const result = await collection.deleteOne({_id: new ObjectId(postId) });
    if (result.deletedCount ===0) {
      res.status(404).json({ error: "Blog post not found"});
    } else {
      res.status(204).json({ message: "Blog post successfully deleted!" });
    }
  } catch (error) {
    console.error("Error deleting blog post", error);
    res.status(500).json({ error: "internal Server Error"});
  } finally {
    await client.close()
  }
})

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });