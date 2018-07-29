const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const mongoose = require('mongoose');

router.get('/' , (req, res , next)=>{
    Product.find().exec().then(doc=>{
        console.log(doc);
        res.status(200).json(doc)
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.post('/' , (req, res , next)=>{
    /*const product ={
        name: req.body.name,
        price: req.body.price
    }*/
    const product  = new Product({
        _id : mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
    .then(result=>{
        console.log(result)
    }).catch(err => console.log(err));

    res.status(200).json({
        message: 'handleing Post requrest to /products',
        createProduct: product
    })
});

router.get('/:productId' ,(req, res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc =>{
            console.log("From database", doc);
            if(doc){
                res.status(200).json({
                    product:doc,
                    request :{
                        type:'GET',
                        url: 'http://localhost:4321/products'
                    }
                })
            }else{
                res.status(404).json({
                    message:"No valid entry found for Product Id"
                });
            }
        }).catch(
            err =>{
                console.log(err);
                res.status(500).json({
                    error: err,
                    errormessage: "this is 500  error"
                });
            }
        );
    /*Product.findById(id).exec().then(
        doc =>{
            console.log(doc);
            res.status(200).json(doc);
        }
    ).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });*/
   /* if(id=== 'sepcial'){
        res.status(200).json({
            message:'You discoverd a special ID'
        });
    }else{
        res.status(200).json({
            message: "this is a common Id" + id
        })
    }*/
});

router.patch('/:productId' ,(req, res , next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id} , {$set: updateOps}).
    exec()
    .then(result=>{
        res.status(200).json({
            message: 'Product update',
            requrest:{
                type:'Get',
                url : 'http://localhost:4321/products/' + id
            }
        })
    }).catch(
        err=>{
            console.log(err)
            res.status(500).json({
                error: err
            })
        }
    )
});

router.delete('/:productId' , (req, res, next)=>{
    const id = req.params.productId;
    
    Product.remove({_id : id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Product deleted' ,
            request:{
                type:'get',
                url:'http://localhost:4321/products' + id,
                data:{
                    name: 'String',price: 'Number'
                }
            }
        })
    }).catch(err=>{
        res.status(500).json({
            request:{
                type:'delete',
                url: 'http://localhost:4321/products/' + id
            }
        })
    })

});

router.delete('/' ,(req, res, next)=>{
    res.status(200).json({
        message: "no item has delete"
    })
})

module.exports = router;