import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String, // Add a field to store verification token
    favorites: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Product',
    },
    cart: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
},{
    timestamps:true
});

const User = mongoose.model('User',userSchema);
export default User;
