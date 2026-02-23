import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for Order
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
    ],
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'Not received'
    },
    DeliveryStatus: {
        type: String,
        default: 'Order Confirmed'
    },
    addressDetails:{
        type: Object
    },
    bankdetails:{
        type: Object
    }
},{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

});

// Define your models
export default mongoose.model('Order', OrderSchema);