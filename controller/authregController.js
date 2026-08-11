const express=require('express');
const authReg=require('../modal/authregSchema');
const bcrypt=require('bcrypt');
const authregController={
    authRegister:async(req,res)=>{
        const {fullName,phoneNumber,email,password}=req.body
        try{
            const existingEmail=await authReg.findOne({email:email});
            if(existingEmail){
                return res.status(401).json({message:"email already exists"});

            }
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new authReg(
            {
                fullName:fullName,
                phoneNumber:phoneNumber,
                email:email,
                password:hashedPassword,
    

            }

        );
    await newUser.save();
    return res.status(201).json({
        message :"Registered",
        Registration:newUser
    }) ; 

        }
   catch (error)
   {
    console.error("Registration Error:",error);
    return res.status(500).json({
        message:"Internal Server Error",
        error:error.message
    });
   }   

} 


  }
  module.exports=authregController;