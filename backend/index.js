const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')
const cors = require('cors');

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
        image_url: `http://localhost:${port}/images/${req.file.filename}`
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


// Schema creating for User Model
const Users = mongoose.model('Users', {
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


// Creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({email: req.body.email});

    if(check){
        return res.status(400).json({success: false, errors: "User with same email already exist"})
    }

    let cart = {};
    for(let i = 0; i < 300; i++){
        cart[i] = 0;
    }
    
    const user = new Users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_string');
    res.json({success: true, token})
})

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;

        if(passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_string');
            res.json({success: true, token})
        }else{
            res.json({success: false, errors: "Wrong Password"})
        }
    }else{
        res.json({success: false, errors: "User does not exist"})
    }
})

// Creating endpoint for newcollection data
app.get('/newcollection', async (req, res) => {
    let products = await Products.find({});

    let newCollection = products.slice(1).slice(-8);
    console.log("New collections fetch");
    res.send(newCollection)
})

// Creating endpoint for popular in women section
app.get('/popularinwomen', async(req, res) => {
    let products = await Products.find({category: "women"})
    let popular_in_women = products.slice(0, 4);
    console.log("popular in women fetched");
    res.send(popular_in_women);
})

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid token"})
    }else{
        try{
            const data = jwt.verify(token, 'secret_string');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors: "Please authenticate using a valid token"})
        }
    }
}

// Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser, async (req, res) => {
    console.log("added", req.body.itemId)
    let userData = await Users.findOne({_id: req.user.id})
    userData.cartData[req.body.itemId] += 1;
    await Users.findByIdAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
    res.send("Added to Cart")
})

// Creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId)
    let userData = await Users.findOne({_id: req.user.id})
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findByIdAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
    res.send("Removed to Cart")
})

// Creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("Get Cart");
    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData)
})




app.listen(port, (error) => {
    if(!error){
        console.log("Server running at port " +port)
    }else{
        console.log("Error: " +error)
    }
})