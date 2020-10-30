var express = require('express');
var app = express();
const PORT=5000;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://cool:PQBfkQnjvp3WLCWe@cluster0.jyfgp.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("hey")
  client.close();
});
const customMiddleware = (req,res,next)=>{
	console.log("middleware exceuted")
	next()
}