import mongoose, { Schema } from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const adminUserSchema = mongoose.Schema({
    personal_info : {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required:true,
            default: "",
        },
        password: String,
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            } 
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
})

export default mongoose.model('admin-users', adminUserSchema)