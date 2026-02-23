import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import User from './Schemas/User.js';
import AdminUser from './Schemas/Admin_user.js';
import CategorySchema from './Schemas/Category.js';
import ProductSchema from './Schemas/Products.js';
import serviceAccountKey from './upvc-website-firebase-adminsdk-4eilf-bcab6c9d3e.json' with {type:"json"};
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import fs, { fstat } from 'fs';
import Razorpay from 'razorpay';
import OrderSchema from './Schemas/OrderSchema.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import CustomerCareSchema from './Schemas/CustomerCare.js';


const server = express();
let PORT = 3000;
server.use(express.json());
server.use(cors());
server.use(bodyParser.json())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.MONGODB, { autoIndex: true });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    return {
        _id: user._id,
        addresses: user.addresses,
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        email: user.personal_info.email,
        fullname: user.personal_info.fullname,
    }
};
const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({"personal_info.username": username}).then((result) => result);

    if (isUsernameNotUnique) {
        username += nanoid().substring(0, 5); // Append nanoid with an underscore separator
    }

    return username;
}


server.post("/signup", (req, res) => {
    
    if (!req.body || !req.body.username || !req.body.fullname || !req.body.email || !req.body.password) {
        return res.status(400).json({"error":"Request body is missing required fields"});
    }
    
    let { username, fullname, email, password } = req.body;

    // Validate fullname
    if(fullname.length < 5){
        return res.status(403).json({"error":"Fullname must be at least 3 characters long"})
    }
    if(username.length < 5){
        return res.status(403).json({"error":"Username must be at least 3 characters long"})
    }

    // Validate email
    if(!email.length){
        return res.status(403).json({"error":"Enter email address"})
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error":"Email is Invalid"})
    }

    // Validate password
    if(!passwordRegex.test(password)){
        return res.status(403).json({"error":"Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letters"})
    }

    bcrypt.hash(password, 10, async (err, hashed_password)=>{
        let user = new User({
            personal_info: {username, email,fullname, password:hashed_password}
        })

        console.log(user)

        user.save().then((u)=>{
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err =>{
            if(err.code == 11000){
                return res.status(500).json({"error":"Email already exists"})
            }
            return res.status(500).json({"error":err.message})
        })
    })
});

server.post("/signin", (req, res) => {
    const { email, password } = req.body;
    User.findOne({"personal_info.email":email})
    .then((user)=>{
        if(!user){
            return res.status(403).json({"error":"email not found"})
        }
        bcrypt.compare(password, user.personal_info.password,(err, result) =>{
            if(err){
                return res.status(403).json({"error":"Error occured while login please try again"})
            }
            if(!result){
                return res.status(403).json({"error":"Incorrect password"})
            } else {
                return res.status(200).json(formatDatatoSend(user))
            }
        })

    })
    .catch(err => {
        console.log(err.message)
        return res.status(500).json({"error":err.message})
    })
});

server.post("/google-auth", async (req, res) => {
    try {
        let { access_token } = req.body;

        // Verify the ID token
        let decodedUser = await getAuth().verifyIdToken(access_token);
        let { email, name, picture } = decodedUser;

        // Update the picture URL if needed
        picture = picture.replace("s96-c", "s384-c");

        // Find the user in the database
        let user = await User.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.mobilenumber personal_info.username personal_info.profile_img google_auth");

        if (user) {
            // Check if the user is not using Google Auth
            if (!user.google_auth) {
                return res.status(403).json({ "error": "This email was signed up without Google. Please login with password to access the account." });
            }
        } else {
            // If user doesn't exist, create a new one
            let username = await generateUsername(email);
            user = new User({
                personal_info: { fullname: name, email, username },
                google_auth: true
            });

            // Save the new user to the database
            await user.save();
        }

        // Return the formatted user data
        return res.status(200).json(formatDatatoSend(user));

    } catch (err) {
        // Handle any errors that occur
        if (err.code === 'auth/id-token-expired') {
            return res.status(401).json({ "error": "Google ID token has expired. Please try again." });
        } else {
            return res.status(500).json({ "error": err.message });
        }
    }
});




let adminemailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let adminpasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const AdminformatDatatoSend = (adminuser) => {
    const access_token = jwt.sign({ id: adminuser._id }, process.env.ADMIN_SECRET_KEY);
    return {
        access_token,
        profile_img: adminuser.personal_info.profile_img,
        username: adminuser.personal_info.username,
        email: adminuser.personal_info.email,
        fullname: adminuser.personal_info.fullname
    };
};
const admingenerateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameNotUnique = await AdminUser.exists({"personal_info.username": username}).then((result) => result);

    if (isUsernameNotUnique) {
        username += nanoid().substring(0, 5); // Append nanoid with an underscore separator
    }

    return username;
}

server.post("/sign-up", (req, res) => {
    
    if (!req.body || !req.body.fullname || !req.body.email || !req.body.password) {
        return res.status(400).json({"error":"Request body is missing required fields"});
    }
    
    let { fullname, email, password } = req.body;

    // Validate fullname
    if(fullname.length < 5){
        return res.status(403).json({"error":"Fullname must be at least 3 characters long"})
    }

    // Validate email
    if(!email.length){
        return res.status(403).json({"error":"Enter email address"})
    }
    if(!adminemailRegex.test(email)){
        return res.status(403).json({"error":"Email is Invalid"})
    }

    // Validate password
    if(!adminpasswordRegex.test(password)){
        return res.status(403).json({"error":"Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letters"})
    }

    bcrypt.hash(password, 10, async (err, hashed_password)=>{
        let username = admingenerateUsername(email)
        let user = new AdminUser({
            personal_info: {username,email,fullname, password:hashed_password}
        })

        console.log(user)

        user.save().then((u)=>{
            return res.status(200).json(AdminformatDatatoSend(u))
        })
        .catch(err =>{
            if(err.code == 11000){
                return res.status(500).json({"error":"Email already exists"})
            }
            return res.status(500).json({"error":err.message})
        })
    })
});

server.post("/sign-in", (req, res) => {
    const { email, password } = req.body;
    AdminUser.findOne({"personal_info.email":email})
    .then((user)=>{
        if(!user){
            return res.status(403).json({"error":"email not found"})
        }
        bcrypt.compare(password, user.personal_info.password,(err, result) =>{
            if(err){
                return res.status(403).json({"error":"Error occured while login please try again"})
            }
            if(!result){
                return res.status(403).json({"error":"Incorrect password"})
            } else {
                return res.status(200).json(AdminformatDatatoSend(user))
            }
        })

    })
    .catch(err => {
        console.log(err.message)
        return res.status(500).json({"error":err.message})
    })
});


server.get('/customer-list' ,async(req,res) =>{
    try {
        const cust = await User.find({})
        res.send({status: "ok", data: cust});
    } catch (error) {
        console.log(error)
    }
})

server.get('/customer/:id', async (req, res) => {
    try {
      const customer = await User.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer Not Found' });
      }
      res.json({ data: customer });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

const categoryFormatotsend = (cate) =>{
    return {
        name: cate.category.name,
        image: cate.category.image
    };
}

server.post('/addcategory',(req,res)=>{
    if (!req.body || !req.body.name || !req.body.image) {
        return res.status(400).json({"error":"Request body is missing required fields"});
    }

    let { name, image } = req.body;

    if(name.length < 4){
        return res.status(403).json({"error":"Name must be at least 4 characters long"})
    }
    if(!isValidURL(image)){
        return res.status(403).json({"error":"PLease enter a valid URL"})
    }

    let category = new CategorySchema({
        category: {name,image}
    })
    console.log(category)

    category.save().then((u)=>{
        return res.status(200).json(categoryFormatotsend(u))
    })
    .catch(err =>{
        if(err.code == 11000){
            return res.status(500).json({"error":"Category already exists"})
        }
        return res.status(500).json({"error":err.message})
    })
})

server.get('/category-list' ,async(req,res) =>{
    try {
        const category = await CategorySchema.find({})
        res.send({status: "ok", data: category});
    } catch (error) {
        console.log(error)
    }
})

server.delete('/categories/:id', async (req, res) => {
    try {
      const category = await CategorySchema.findByIdAndDelete(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}); 

const productFormatotsend = (product) => {
    return {
        name: product.name,
        description: product.description,
        offerprice: product.offerprice,
        price: product.price,
        categoryinProduct: product.categoryinProduct,
        countInStock: product.countInStock,
        image: product.image
    };
}

server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

server.post('/product', upload.single('image'), async (req, res) => {
    // Handle product creation logic
    try {
        const { name, description, offerprice, productWeight, price, categoryinProduct, countInStock } = req.body;
        const image = req.file ? req.file.path : null; // Get file path from req.file
        
        // Your logic to create a product and save it to the database
        const product = new ProductSchema({
            name,
            description,
            offerprice,
            productWeight,
            price,
            categoryinProduct,
            countInStock,
            image // Save the image path
        });

        await product.save();
        res.status(200).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.post('/updateproduct/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the product by ID
      const product = await ProductSchema.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Update product details
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.categoryinProduct = req.body.categoryinProduct || product.categoryinProduct;
      product.productWeight = req.body.productWeight || product.productWeight;
      product.offerprice = req.body.offerprice || product.offerprice;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
  
      // Update image if provided
      if (req.file) {
        product.image = req.file.path;
      }
  
      // Save the updated product
      await product.save();
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  });

server.get('/product' ,async(req,res) =>{
    try {
        const product = await ProductSchema.find({})
        res.send({status: "ok", data: product});
    } catch (error) {
        console.log(error)
    }
})

server.delete('/product/:id', async (req, res) => {
    try {
      const category = await ProductSchema.findByIdAndDelete(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}); 

server.get('/products/:id', async (req, res) => {
    try {
      const customer = await ProductSchema.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer Not Found' });
      }
      res.json({ data: customer });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


server.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).send({ error: 'Query parameter is required' });
    }
  
    try {
      const regex = new RegExp(query, 'i'); // Case-insensitive regex
      const products = await ProductSchema.find({ name: regex }).limit(10); // Limit results for performance
      res.json(products);
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
});


server.post("/add-address/:id", async (req, res) => {
    try {
        // Fetch user by _id
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Create new address object from request body
        const newAddress = {
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            landmark: req.body.landmark,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state
        };

        // Add new address to the addresses array
        user.addresses.push(newAddress);

        // Save the updated user document
        await user.save()

        // Send response
        res.status(200).send('Address added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

server.get("/get-addresses/:id", async (req, res) => {
    try {
        // Fetch user by _id
        let user = await User.findById(req.params.id);
        res.send({data:user.addresses});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

server.delete('/delete-address/:userId/:addressId', async (req, res) => {
    try {
      const { userId, addressId } = req.params;
  
      // Find the user and update the addresses array
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Filter out the address to delete
      user.addresses = user.addresses.filter(address => address._id != addressId);
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

server.post('/place-order-cash', async (req, res) => {
  const { userId, addressId, cart, totalAmount, paymentMethod,quantity,bankpayment } = req.body;
  console.log("product id",cart.map((e)=>{
    console.log("product ids:",e._id)
  }))
  console.log("Payment method",paymentMethod)

  try {
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    let products = [];
    let prodId = [];
    let productName = []

    cart.forEach((e) => {
        products.push(e);
        prodId.push(e._id);
        productName.push(e.name);
    });

    let paymentStatus;
    if (paymentMethod === 'bank') {
        paymentStatus = "Not received";
    } else {
        paymentStatus = 'Received';
    }

    const selectedAddress = user.addresses.id(addressId);
  
      // If the selected address is not found, send a 404 response
      if (!selectedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }

    // Create new Order document
    const newOrder = new OrderSchema({
        userId: user._id,
        items: products,
        productId: prodId,
        quantity: quantity,
        addressDetails: selectedAddress,
        productname: productName,
        totalAmount: totalAmount,
        paymentType: paymentMethod,
        paymentStatus: paymentStatus,
        DeliveryStatus: "Order Not Confirmed",
        bankdetails: bankpayment
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Optionally, you can update the user's order history or perform other actions here

    // Send success response
    res.status(201).json({
        success: true,
        message: 'Payment success and order processed successfully.',
        order: savedOrder
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
  
// Endpoint to create an order
server.post('/create-order-card', async (req, res) => {
    const { userId, addressId, paymentMethod, totalAmount, cart } = req.body;
  
    const options = {
      amount: totalAmount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error('Error in creating Razorpay order:', error);
      res.status(500).json({ error: 'Unable to create order. Please try again later.' });
    }
  })
  
  // Endpoint to verify payment success
  server.post('/payment-success', async (req, res) => {
    // Destructure the request body to extract paymentData and orderData
    const { paymentData, orderData } = req.body;
  
    try {
      // Find the user document using the userId from orderData
      const user = await User.findById(orderData.userId);
  
      // If the user is not found, send a 404 response
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the selected address from the user's addresses array using the addressId from orderData
      const selectedAddress = user.addresses.id(orderData.addressId);
  
      // If the selected address is not found, send a 404 response
      if (!selectedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      // Map the cart items to include the necessary information, such as quantity
      const products = orderData.cart.map(item => ({
        ...item,
        quantity: item.quantity,
      }));
  
      // Extract product IDs from the cart items
      const prodId = products.map(item => item._id);
  
      // Determine the payment status based on the payment method
      let paymentStatus;
      if (orderData.paymentMethod === 'bank') {
        paymentStatus = "Not received";
      } else {
        paymentStatus = 'Received';
      }
  
      // Create a new order document using the OrderSchema
      const newOrder = new OrderSchema({
        userId: user._id,
        items: products,
        quantity: orderData.quantity,
        productId: prodId,
        totalAmount: orderData.totalAmount,
        paymentType: orderData.paymentMethod,
        paymentStatus: paymentStatus,
        addressDetails: selectedAddress, // Optionally, save the entire address details
      });
  
      // Save the new order to the database
      const savedOrder = await newOrder.save();
  
      // Send a success response with the saved order
      res.status(201).json({
        success: true,
        message: 'Payment success and order processed successfully.',
        order: savedOrder,
      });
  
    } catch (error) {
      // Handle any errors that occur during processing
      console.error('Error processing payment and order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  server.get('/orders-list', async (req, res) => {
    try {
        // Fetch orders and populate 'items' with product documents and 'userId' with user documents
        const orders = await OrderSchema.find().populate({
            path: 'items',
            model: 'Product', // Assuming the model name is 'Products'
            select: 'name description offerprice price categoryinProduct countInStock image',
        }).populate({
            path: 'userId',
            model: 'User', // Assuming the model name is 'User'
            select: 'personal_info.username personal_info.email personal_info.fullname personal_info.profile_img addresses',
        });

        console.log(orders);

        // Extract relevant information and send response
        const formattedOrders = orders.map(order => ({
            orderId: order._id,
            userId: order.userId._id,
            user: {
                username: order.userId.personal_info.username,
                email: order.userId.personal_info.email,
                fullname: order.userId.personal_info.fullname,
                profile_img: order.userId.personal_info.profile_img,
            },
            address: order.addressDetails,
            items: order.items.map(item => ({
                _id: item._id,
                name: item.name,
                description: item.description,
                offerprice: item.offerprice,
                price: item.price,
                categoryinProduct: item.categoryinProduct,
                countInStock: item.countInStock,
                image: item.image,
            })),
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            paymentType: order.paymentType,
            paymentStatus: order.paymentStatus,
            DeliveryStatus: order.DeliveryStatus,
            bankdetails: order.bankdetails,
            joinedAt: order.joinedAt
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

server.patch('/update-order-status', async (req, res) => {
    const { orderId, paymentStatus, deliveryStatus } = req.body;
  
    try {
      // Find and update the order by ID
      const updatedOrder = await OrderSchema.findByIdAndUpdate(
        orderId,
        { paymentStatus:"recieved", DeliveryStatus:"Order Confirmed" },
        { new: true } // Return the updated document
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

server.patch('/update-order-status-track', async (req, res) => {
    const { orderId, newStatus } = req.body;
  
    try {
      const order = await OrderSchema.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Update the delivery status
      order.DeliveryStatus = newStatus;
      await order.save();
  
      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

server.get('/user-orders/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
        // Fetch user-specific orders and populate 'items' with product documents and 'userId' with user documents
        const orders = await OrderSchema.find({ userId: userId }).populate({
            path: 'items',
            model: 'Product', // Assuming the model name is 'Product'
            select: 'name description offerprice price categoryinProduct countInStock image',
        }).populate({
            path: 'userId',
            model: 'User', // Assuming the model name is 'User'
            select: 'personal_info.username personal_info.email personal_info.fullname personal_info.profile_img addresses',
        });

        console.log(orders);

        // Extract relevant information and send response
        const formattedOrders = orders.map(order => ({
            orderId: order._id,
            userId: order.userId._id,
            user: {
                username: order.userId.personal_info.username,
                email: order.userId.personal_info.email,
                fullname: order.userId.personal_info.fullname,
                profile_img: order.userId.personal_info.profile_img,
            },
            address: order.addressDetails,
            items: order.items.map(item => ({
                _id: item._id,
                name: item.name,
                description: item.description,
                offerprice: item.offerprice,
                price: item.price,
                categoryinProduct: item.categoryinProduct,
                countInStock: item.countInStock,
                image: item.image,
            })),
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            paymentType: order.paymentType,
            paymentStatus: order.paymentStatus,
            DeliveryStatus: order.DeliveryStatus,
            bankdetails: order.bankdetails
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  
server.get('/orders-list/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch orders specific to the userId and populate 'items' with product documents
        const orders = await OrderSchema.find({ userId }).populate({
            path: 'items',
            model: 'Product', // Assuming the model name is 'ProductSchema'
            select: 'name description offerprice price categoryinProduct countInStock image',
        });

        // Extract relevant information and send response
        const formattedOrders = await Promise.all(orders.map(async (order) => {
            // Fetch user details from User schema
            const user = await User.findById(userId); // Fetch user by userId
            if (!user) {
                throw new Error('User not found');
            }

            // Fetch all products for the current order
            const products = await ProductSchema.find({ _id: { $in: order.items.map(item => item._id) } });

            // Fetch user address based on addressId
            const userAddress = user.addresses.find(address => address._id.toString() === order.addressId.toString());

            return {
                orderId: order._id,
                user: {
                    _id: user._id,
                    username: user.personal_info.username,
                    email: user.personal_info.email,
                    fullname: user.personal_info.fullname,
                    profile_img: user.personal_info.profile_img,
                    addresses: userAddress,
                },
                items: products.map(product => ({
                    _id: product._id,
                    name: product.name,
                    offerprice: product.offerprice,
                    image: product.image,
                    quantity: order.items.map(item => item.quantity), // Assuming 'quantity' is directly available in 'items'
                })),
                totalAmount: order.totalAmount,
                paymentType: order.paymenttype,
                paymentStatus: order.paymentStatus,
                joinedAt: order.joinedAt,
                DeliveryStatus: order.DeliveryStatus,
            };
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

server.patch('/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { DeliveryStatus } = req.body;
  
    try {
      const order = await OrderSchema.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.DeliveryStatus = DeliveryStatus;
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

server.post('/product-review/:productId/:userId',async(req, res)=>{
    let { productId, userId } = req.params;

    try {
        let product = await ProductSchema.findById(productId);
        if (!product) {
            return res.status(404).send('User not found');
        }
        let fromatted = {
            userId: userId,
            comment: req.body.comment,
            rating: req.body.rating
        }
        product.reviews.push(fromatted);
        await product.save();
        return res.status(200).send("Review Added successfully")
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

server.get("/product-review/:productId", async (req, res) => {
    let productId = req.params.productId;
    try {
        let product = await ProductSchema.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        let finalData = await Promise.all(product.reviews.map(async (review) => {
            let user = await User.findById(review.userId);
            if (user) {
                return {
                    id: review._id,
                    userId: {
                        id: review.userId,
                        username: user.personal_info.username || 'Anonymous',
                        email: user.personal_info.email || 'No email',
                        profile_img: user.personal_info.profile_img || 'default_img.jpg',
                        fullname: user.personal_info.fullname || 'Anonymous',
                    },
                    rating: review.rating,
                    comment: review.comment
                };
            } else {
                return {
                    id: review._id,
                    userId: {
                        id: review.userId,
                        username: 'Unknown User',
                        email: 'Unknown Email',
                        profile_img: 'default_img.jpg',
                        fullname: 'Unknown User',
                    },
                    rating: review.rating,
                    comment: review.comment
                };
            }
        }));

        console.log(finalData);
        res.send({ data: finalData });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


server.delete('/product-review/:productId/:reviewId', async (req, res) => {
    const { productId, reviewId } = req.params;
    
    try {
        // Find the product and remove the review with the given reviewId
        const updatedProduct = await ProductSchema.findByIdAndUpdate(
            productId,
            { $pull: { reviews: { _id: reviewId } } },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product or review not found' });
        }

        res.status(200).json({
            message: 'Review deleted successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'An error occurred while deleting the review' });
    }
});

server.get('/product-review/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let product = await ProductSchema.findById(id).populate('reviews'); // Populate reviews if they are stored in a separate schema
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }


        res.status(200).json({
            data: {
                ...product.toObject(),
                averageRating
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the review' });
    }
});


server.get('/random-reviews', async (req, res) => {
    try {
      const reviews = await ProductSchema.aggregate([
        { $unwind: '$reviews' },
        { $sample: { size: 10 } },
        {
          $lookup: {
            from: 'users', // The collection name in MongoDB is usually pluralized
            localField: 'reviews.userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            name: '$name',
            review: '$reviews',
            username: '$user.personal_info.username',
            userImage: '$user.personal_info.profile_img' // Adjust field name as per your schema
          }
        }
      ]);
  
      res.status(200).json({
        data: reviews
    });
    } catch (error) {
      console.error('Error fetching random reviews:', error);
      res.status(500).send('Internal Server Error');
    }
});

server.post('/customer-care', async (req, res) => {
    const { name, email, mobileNumber, query, howDoYouKnow } = req.body;

    try {
        // Create a new instance of the schema model with the provided data
        const formData = new CustomerCareSchema({
            name,
            email,
            mobileNumber,
            query,
            howDoYouKnow
        });

        // Save the instance to the database
        await formData.save();

        // Respond with a success message
        return res.status(200).json({ message: "Query Sent Successfully" });
    } catch (error) {
        // Log error and send a response with a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

server.get('/querys',async(req, res) => {
    try {
        let query = await CustomerCareSchema.find({})
        return res.status(200).json({ data: query });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});