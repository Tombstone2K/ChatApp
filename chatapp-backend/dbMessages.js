import mongoose from "mongoose";

const whatsappSchema=mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    received:Boolean,
    sender:Number,
    receiver:Number
});



export default mongoose.model('chat',whatsappSchema)