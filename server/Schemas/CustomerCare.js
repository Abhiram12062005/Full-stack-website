import mongoose from "mongoose";
import { Schema } from "mongoose";

const CustomerCareSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    mobileNumber:{type:Number, required:true},
    query:{type:String, required:true},
    howDoYouKnow:{type:String, required:true},
})

export default mongoose.model("CustomerCare", CustomerCareSchema);