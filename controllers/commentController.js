
const AsyncHandler = require('express-async-handler')
const AppError = require('../error/AppError')
const Comment = require('../models/commentModel.js')
const Product = require('../models/productModel')

const addComment = AsyncHandler(async (req,res,next) => {
    const id = req.params.id
    // console.log(id);
    // if (!mongoose.Types.ObjectId.isValid(id))
    // return next(new AppError("ID is invalid"), 400);
    
    const product = await Product.findById(id)
    
    if (!id || !product) {
        return next(new AppError('product not found',400))
    }
    if (
        await Comment.findOne({ createBy : req.user._id , productId : product._id})
    ) {
        return next(new AppError('already commented  this product ' , 400))
    }
        // console.log(product);
    const comment = await Comment.create({
        comment: req.body.comment,
        createBy: req.user._id,
        productId: product._id
    })
    if (comment) {
       return res.status(200).json({
            status: 'success',
            comment
        })
    }
})

const getCommentsOnProduct = AsyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Enter a valid ID product name", 400));
    } 
    const comments = await Comment.find({ productId: product._id });
    
    return res
      .status(201)
        .json({ status: "success", results: comments.length, data: comments });

})

module.exports = {addComment , getCommentsOnProduct }