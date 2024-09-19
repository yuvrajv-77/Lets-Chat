const TheUser = require("../models/UserModel");
const generateToken = require("../Config/generatetToken");
const ExAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const loginController = ExAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await TheUser.findOne({ email });

    if (!user) {
      console.log("no user found");
      return res.status(400).json({ failed: "No User Found" });
    }
    // if user is null just return the error code further code will not execute
    const ispasswordValid = await bcrypt.compare(password, user.password);

    if (!ispasswordValid) {
      console.log("invalid password");
      return res.status(400).json({ failed: "wrong password" });
    } 
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
      token: generateToken(user._id), // function to generate jwt token and send to browser
    });
    
  } catch (error) {
    res.status(401).json({ error: "❌😵❌  Error in login user" });
    console.log("❌😵❌  Error in login user");
  }
});



// code to control the register function
const registerController = ExAsyncHandler(async (req, res) => {
  const { name,username, email, password } = req.body;

  // check if any fields are empty
  if (!name || !email || !password) {
    console.log("all fields are required");
    return res.sendStatus(400).json({ error: "all fields are required" }); // return statement is necessary as it block the execution of further code
  }

  // check for user already exist
  const userExist = await TheUser.findOne({ email });
  if (userExist) {
    console.log("Email already exist");
    return res.status(201).send("Email already exists");
  }
  const usernameExist = await TheUser.findOne({ username });
  if (usernameExist) {
    console.log("username already exist");
    return res.status(201).send("Username already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt
  // create new entry in database
  try {
    const user = await TheUser.create({
      name,
      email,
      password: hashedPassword,
      username
    });
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        username,
        token: generateToken(user._id), // function to generate jwt token and send to browser
      });
    }
  } catch (error) {
    res.status(401).json({ error: "❌😵❌  Error in registering user" });
    console.log("❌😵❌  Error in registering user");
  }
});

const searchUserController = ExAsyncHandler(async(req,res) =>{
  try{
    const keyword = req.query.search ? {
        username:req.query.search.toLowerCase()}
    :{} 
    
    const users = (await TheUser.find(keyword))
    res.send(users);
    console.log('Searched Users:', users);
  }catch{
    console.log("No user Found");
    res.status(401)
  }
  
})



module.exports = { registerController, loginController, searchUserController };
