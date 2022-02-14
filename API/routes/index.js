// const express = require('express');
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

module.exports = (app) => {
  app.post("/register", async (req, res) => {
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        // return res.status(409).send("User Already Exist. Please Login");
     return res.status(409).json({result:false,msg:"User Already Exist. Please Login",data:null});

      }

      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      user.password = null;
      // return new user
     // res.status(201).json(user);
     return res.status(201).json({result:true,msg:"User Created",data:user});

    } catch (err) {
      console.log(err);
    }
  });

  app.post("/login", async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;
        user.password = null;
        // res.status(200).json(user);
        res.status(200).json({result:true,msg:"Success",data:user});

      }
     res.status(200).json({result:false,msg:"invalid credentials",data:null});
    // return req.sendResponse(400, "Invalid Credentials");

    } catch (err) {
      console.log(err);
    }
  });

//Auth route
  app.post("/updateUser",auth, async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
      const filter = { email: email};
      encryptedPassword = await bcrypt.hash(password, 10);
      // Create user in our database
      const user = {
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      }
      let updatedUser = await User.findOneAndUpdate(filter, user, {returnOriginal: false});

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      if(!updatedUser)
      {
      // res.status(408).json('can not update email');
     res.status(200).json({result:false,msg:"can not update email",data:null});
      return;
      }
      // save user token
      updatedUser.token = token;
      updatedUser.password = null
      // res.status(201).json(updatedUser);
     res.status(200).json({result:true,msg:"Updated",data:updatedUser});

    } catch (err) {
      console.log(err);
    }
  });
};