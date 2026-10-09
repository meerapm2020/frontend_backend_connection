import mongoose from "mongoose";
const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
         type:String,
        required:true
    },
    category:{
         type:String,
        required:true
    },
    price:{
         type:Number,
        required:true
    },
    quantity:{
         type:Number,
        required:true
    }
},
{
    timestamps:true
}
);

const Book=mongoose.model("Book",bookSchema);
export default Book;