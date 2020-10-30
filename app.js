// Dependencies
var express = require('express');
var app = express();
const mongoose=require('mongoose');
const PORT=process.env.PORT || 5000;
const {MONGOURI}=require('./config/keys');
//const cors=require('cors')

mongoose.connect(MONGOURI,{
	useNewURLParser:true,
	useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
	console.log("Connected")
	console.log(MONGOURI)
	console.log("staying")
})

mongoose.connection.on('error',(err)=>{
	console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
})


require('./models/user')
require('./models/post')

//app.use(cors())
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
	app.use(express.static('client/build'))
	const path=require('path')
	app.get("*",(req,res)=>{
		res.sendFile(path.resolve(_dirname,'client','build','index.html'))
	})
}
app.listen(PORT,()=>{
	console.log("Server is running on",PORT);
})

