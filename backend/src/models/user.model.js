import mongoose from "mongoose"
import bcrypt from 'bcryptjs'; // <--- MUST BE HERE
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
         required:true,
        unique:true,
    },
    password:{
        type:String,
         required:true,

    },
    avatar:{
        type:String,
        default:'https://placehold.co/200x200'
    },
    bio:{
        type:String,
        maxlength:150

    },
    savedPosts:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}]
},
{timestamps:true});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
 // next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;