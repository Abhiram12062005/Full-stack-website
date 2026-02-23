import mongoose, { Schema } from "mongoose";

let profile_image_name_list = ['Pepper','Nala','Mittens','Sassy','Sugar','Socks','Bear','Garfield','Lucky','Gracie','Tinkerbell','Max','Midnight','Jack','Felix','Lily','Bandit','Milo','Lucy','Boots','Bailey','Chloe','Cuddles','Oscar','Annie','Luna','Kiki','Baby','Lola','Sasha','Zoey','Jack','Angel','Jasper','Misty','Sammy','Peanut','Kitty','Dusty','Casper','Lily','Boo']
let profile_image_collection_list = ['micah','notionists']

const addressSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
        required: true,
    },
    landmark: String,
    pincode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    }
});

const userSchema = new Schema({
    personal_info: {
        username: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, 'Username must be 3 length long']
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: true,
            default: "",
        },
        password: String,
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_image_collection_list[Math.floor(Math.random() * profile_image_collection_list.length)]}/svg?seed=${profile_image_name_list[Math.floor(Math.random() * profile_image_name_list.length)]}`
            }
        }
    },
    addresses: [addressSchema], // Updated to be an array of addresses
    google_auth: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'joinedAt'
    }
});

export default mongoose.model('User', userSchema);