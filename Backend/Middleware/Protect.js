const jwt = require("jsonwebtoken");
const ExAsyncHandler = require("express-async-handler");
const TheUser = require("../models/UserModel");

const protect = ExAsyncHandler(async(req,res,next) => {
    let token;
    
    if (    //This checks if the Authorization header exists in the request and if it starts with the word "Bearer".
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];    //If the Authorization header is correctly formatted, this line extracts the JWT from it. 
            
            // console.log('Token:', token);
            //It does this by splitting the Authorization header at each space and taking the second element of the resulting array, which is the token.

            //decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  //This line decodes the JWT using the secret key stored in process.env.JWT_SECRET. 
            //The jwt.verify function returns the payload of the JWT, which is stored in this decoded variable.
            // console.log('Decoded:', decoded);
            req.user = await TheUser.findById(decoded.id)   //This line finds the user in the database whose ID matches the ID in the decoded JWT payload. 
            //It then attaches this user to the req object as req.user.
            // console.log('User in protect:', req.user);
            next();     // necessary. if above code fine next will pass the execution to controller
            
        }catch(error){
            res.status(401).json({failed:'Not Authorized'});
            console.log("Not Authorized", error);
        }
    }

    if(!token){
        res.status(401).json({error: 'no token found'})
        console.log('No Token found');
        
    }
})

module.exports = {protect};