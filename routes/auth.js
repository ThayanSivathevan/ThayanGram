const express = require('express')
const router =express.Router()
const mongoose= require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET,API_KEY,RESET} = require('../config/keys')
const requireLogin=require('../middleware/requireLogin')
const nodemailer =require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { send } = require('process')



const transporter = nodemailer.createTransport(sendgridTransport({
	auth:{
		API_KEY
	}
}))
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
				transporter.sendMail({
					to:user.email,
					from:"noreplythayangram@gmail.com",
					subject:"Welcome to ThayanGram",
					html:"<h1>Welcome to ThayanGram</h1><p>Thank you for signing up-Thayan Sivathevan</p>"
				})
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


router.post('/reset-password',(req,res)=>{
	crypto.randomBytes(32,(err,buffer)=>{
		if(err){
			console.log(err)
		}
		const token =buffer.toString("hex")
		User.findOne({email:req.body.email})
		.then(user=>{
			if(!user){
				return res.status(422).json({error:"User does not exist with that email"})
			}
			user.resetToken = token
			user.expireToken=Date.now() + 3600000
			user.save().then((result)=>{
				transporter.sendMail({
					to:user.email,
					from:"noreplythayangram@gmail.com",
					subject:"Forgot Password",
					html:`
					<p>You requested a password reset
					<h5>click on this link <a href="${RESET}/reset/${token}">link</a> to reset password</h5>
					`
				})
				res.json({message:"check your email"})
			})
		})
	})
})

router.post('/new-password',(req,res)=>{
	const newPassword = req.body.password
	const sendToken =req.body.token
	User.findOne({resetToken:sendToken,expireToken:{$gt:Date.now()}})
	.then(user=>{
		if(!user){
			return res.status(422).json({error:"Try again session expired"})
		}
		bcrypt.hash(newPassword,12).then(hashedpassword=>{
			user.password=hashedpassword
			user.resetToken =undefined
			user.expireToken=undefined
			user.save().then((savedUser)=>{
				res.json({message:"password updated success"})
			})
		})
	}).catch(err=>{
		console.log(err)
	})
})
module.exports=router