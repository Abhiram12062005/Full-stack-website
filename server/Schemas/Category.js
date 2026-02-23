import mongoose, { Schema } from "mongoose";

const CategorySchema = mongoose.Schema({
    category:{
        name :{
            type: String,
            unique: true,
            required: true,
        },
        image :{
            type:String,
            required: true
        }
    }
},{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

})

export default mongoose.model('Category',CategorySchema)