import express from "express";
import Book from "../models/Book.js";

const router=express.Router();

//create a Book

router.post("/",async (req,res)=>{
    try{
        const book=new Book(req.body);
        const savedBook=await book.save();

        res.status(201).json({
            message:"Book added successfully",
            book:savedBook
        });
    }catch(error){
        res.status(500).json({
            message:"Error adding Book",
            error:error.message
        });
    }
});


//Get all books

router.get("/",async(req,res)=>{
    try{
        const books=await Book.find();
        res.json(books);
    }catch(error){
        res.status(500).json({
            message:"Error fetching books",
            error:error.message
        });
        
    }
});

//get single book
router.get("/:id",async(req,res)=>{
    try{
        const book=await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({
            message:"Book not Found",
            error:error.message
        });

        }
        res.json(book);
    }catch(error){
         res.status(500).json({
            message:"Error fetching books",
            error:error.message
        });

    }
});

//update book
router.put("/:id",async(req,res)=>{
    try{
        const book=await Book.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!book){
            return res.status(404).json({message:"Book not found"})
        }
        res.json({
            message:"Book updated successfully",
            book:book
        });
    }catch(error){
        res.status(500).json({
            message:"Error updating books",
            error:error.message
        });
    }
});

//delete a book
router.delete("/:id",async(req,res)=>{
    try{
        const book=await Book.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({message:"Book not found"})
        }
        res.json({
            message:"Book deleted successfully",   
        });
    }catch(error){
        res.status(500).json({
            message:"Error deleting books",
            error:error.message
        });
    }
});

export default router;