const express = require('express')
const router =express.Router()
const mongoose= require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin=require('../middleware/requireLogin')


router.post('/signup',(req,res)=>{
	const{name,email,password,url} = req.body
	if(!email||!password||!name){
		return res.status(422).json({error:"please fill all fields"})
		
	}
	User.findOne({email:email}).then((savedUser)=>{
		if(savedUser){
			return res.status(422).json({error:"user alread exists witht that email"})
		}
		bcrypt.hash(password,12)
		.then(hashedpassword=>{
			const user=new User({
				email,
				password:hashedpassword,
				name,
				url
			})
			user.save().then(user=>{
				res.json({message:"saved sucessfully"})
			})
			.catch(err=>{
				console.log(err)
			})
		})
		
	})
	.catch(err=>{
		console.log(err)
	})

})

router.post('/signin',(req,res)=>{
	const {email,password}=req.body
	if(!email || !password){
		return res.status(422).json({error:"please provide email or password"})
	}
	User.findOne({email:email}).then(savedUser=>{
		if(!savedUser){
			return res.status(422).json({error:"invalid"})
		}
		bcrypt.compare(password,savedUser.password).then(doMatch=>{
			if(doMatch){
				//res.json({message:"successful login"})
				const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
				const{_id,name,email,followers,following,url}=savedUser
				res.json({token,user:{_id,name,email,followers,following,url}})
			}
			else{
				return res.status(422).json({error:"Invalid login"})
			}
		}).catch(err=>{
			console.log(err);
		})
	})
})
module.exports=router