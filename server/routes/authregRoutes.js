const express=require('express');
const authregRoutes=express.Router();
const authregController=require('../controller/authregController');
authregRoutes.post('/authregister', authregController.authRegister);
module.exports=authregRoutes;