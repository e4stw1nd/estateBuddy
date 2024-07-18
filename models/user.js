const mongoose=require('mongoose');
const Schema =mongoose.Schema;
const passport_mon=require('passport-local-mongoose');
const userSchema=new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    }
});
userSchema.plugin(passport_mon);
module.exports=mongoose.model('User',userSchema);