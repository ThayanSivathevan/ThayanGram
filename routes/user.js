const express = require('express')
const router =express.Router()
const mongoose= require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")


router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:err})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},
    (err,result)=>{
        console.log(result)
        if(err){
            console.log(false)
            return res.status(422).json({error:err})
        }
        else{
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}

            },{new:true}).select("-password").then(result=>{
                console.log(true)
                res.json(result)
            }).catch(err=>{
                console.log(false)
                return res.status(422).json({error:err})
            })
        }
    })
})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},
    (err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.unfollowId}

            },{new:true}).select("-password").then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        }
    })
})

router.post('/changeprofile',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        url:req.body.url
    },{new:true},
    (err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})



module.exports=router