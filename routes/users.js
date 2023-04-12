var express = require("express");
var router = express.Router();
const { randomUUID } = require('crypto');
const mongoose = require("mongoose");
var UserInfo = require("../models/UserInfo");
const {
  generatePasswordHash,
  validatePassword,
  generateUserToken,
  verifyToken,
} = require("../auth");

const mongoDB = process.env.ATLAS_URI;
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});


router.post("/registration", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10

    const passwordHash = await generatePasswordHash(password, saltRounds);

    const newUserInfo = new UserInfo({
      email: email,
      password: passwordHash,
      id: randomUUID(), // uid stands for User ID. This will be a unique string that we will can to identify our user
    });

  
    const savedData =  await newUserInfo.save();

    console.log(password);
    console.log(passwordHash);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.toString() });
  }
});

router.post("/login", async (req, res) => {
  try {
    
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserInfo.findOne({
      email: email,
    });

    if (!user) {
      res.json({ success: false, message: "Could not find user." }).status(204);
      return;
    }

    const isPWValid = await validatePassword(password, user.password);

    if (!isPWValid) {
      res
        .json({ success: false, message: "Password was incorrect." })
        .status(204);
      return;
    }

    const userType = email.includes("codeimmersives.com") ? "admin" : "user";

      const data = {
      date: new Date(),
      userId: user.id, 
      scope: userType,
			email: email
    };

    const token = generateUserToken(data);

    res.json({ success: true, token, email });
    return;
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.toString() });
  }
});

router.get("/message", (req, res) => {
  try {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.header(tokenHeaderKey);

		console.log("token ", token)

		const verifiedTokenPayload = verifyToken(token)

    if (!verifiedTokenPayload) {
      return res.json({
        success: false,
        message: "ID Token could not be verified",
      });
    }

		console.log(verifiedTokenPayload)
    const userData = verifiedTokenPayload.userData;

    if (userData && userData.scope === "user") {
      return res.json({
        success: true,
        message: `I am a normal user with the email: ${userData.email}`,
      });
    }

		if (userData && userData.scope === "admin") {
      return res.json({
        success: true,
        message: `I am an admin user with the email ${userData.email}`,
      });
    }

    throw Error("Access Denied");
  } catch (error) {
    // Access Denied
    return res.status(401).json({ success: false, message: error });
  }
})

router.get("/all", async (req, res) => {
  try {
    const allUsers = await UserInfo.find({});
    res.json({users: allUsers });
  }catch(e){
    console.log(e);
  }
     
})
;

module.exports = router;
