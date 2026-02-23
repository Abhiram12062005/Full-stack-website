import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
});

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    offerprice: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    productWeight: {
        type: Number,
        required: true,
    },
    categoryinProduct: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
    },
    reviews: [ReviewSchema]
});

export default mongoose.model('Product', ProductSchema);
