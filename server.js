const express = require("express");
const { MongoClient} = require("mongodb");
const app = express();
const port = 3000;
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

