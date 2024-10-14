const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')
const cors = require('cors');
const { type } = require('os');

const app = express();
const port = 4000;


app.use(express.json());
app.use(cors());


// Database Connection with MongoDB
mongoose.connect("mongodb+srv://promisedigitals1999:VXVR8drpzFioGBT5@kleinstore-website.s75df.mongodb.net/")


// API Endpoint Creation
app.get('/', (req, res) => {
    res.send('Express App is running')
})


// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage});

// Creating Upload Endpoint for Images
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {

    res.json({
        success: 1,
        image_url: `http:localhost:${port}/images/${req.file.filename}`
    })
})


// Schema for Creating products
const Products = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    available: {
        type: Boolean,
        default: true
    }
})

// API for adding products
app.post('/addproduct', async (req, res) => {
    // generating id automatically
    let products = await Products.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1
    }else{
        id=1;
    }
    const product = new Products({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Product Saved");
    res.json({
        success: true,
        name: req.body.name, 
    })
})


// API for deleting products
app.post('/removeproduct', async (req, res) => {
    await Products.findOneAndDelete({id: req.body.id});
    console.log("Product Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})


// API for getting all products
app.get('/allproducts' , async (req, res) => {
    let products = await Products.find({});
    console.log('All products fetched');
    res.send(products);
})



app.listen(port, (error) => {
    if(!error){
        console.log("Server running at port " +port)
    }else{
        console.log("Error: " +error)
    }
})