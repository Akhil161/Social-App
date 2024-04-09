const express = require('express')
const Post = require('../models/Post')

const router = express.Router()


// Get All Post
router.get('/',async(req,res)=>{
    try {
        const posts = await Post.find()
        .populate('createdBy')
        .populate('likes')
        .populate({
            path:'comments',
            populate:{
                path:'createdBy',
                model:'user'
            }
        })
        .sort({createdAt:-1})
        res.json(posts)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


// Create New Post
router.post('/',async(req,res)=>{
    try {
        const data ={
            postText:req.body.postText,
            createdAt:req.body.createdAt,
            imageUrl:req.body.imageUrl,
            createdBy:req.body.createdBy,
        }

        const postRes = await Post.create(data)
        res.status(201).json(postRes);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// Like/dislike post
router.put("/like/:postId",async(req,res)=>{
    try {
         const postid= req.params.postId;
         const data = {
            userId:req.body.userId,
            isLike:req.body.isLike,
         }
         const post = await Post.findById(postid)
         if(!post.likes){
            const updatePost = await Post.findByIdAndUpdate(postid,{likes:[]},
                {
                    upsert:true,
                    runValidators:true
                })
                await updatePost.save();
         }
         const updatedPost = await Post.findById(postid);
         data.isLike?updatedPost.likes.push(data.userId):updatedPost.likes.pop(data.userId)
        const result = await updatedPost.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

module.exports = router;