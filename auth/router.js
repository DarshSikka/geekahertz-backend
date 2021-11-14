const express = require("express");
const { sendMail } = require("./mail");
const User = require("../models/User");
const { v4: uuid4 } = require("uuid");
const router = express.Router();
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const uuid = uuid4();
  const usr = new User({ username, email, password, uuid });
  const find = await User.findOne({ username });
  if (find) {
    return res.send({
      error: true,
      status: 400,
      message: "Username Taken",
    });
  }
  const find2 = await User.findOne({ email });
  if (find2) {
    return res.send({
      error: true,
      status: 400,
      message: "Email Taken",
    });
  }
  usr.save((err) => {
    console.log(err);
    if (err) {
      res.send({
        error: true,
        status: 401,
        message: "Invalid username or email",
      });
    } else {
      res.send({
        error: false,
        status: 200,
        uuid,
        message: "User created!",
      });
    }
  });
});
router.post("/login", async (req, res) => {
  const { identity, credential } = req.body;
  const check1 = await User.findOne({ email: identity, password: credential });
  if (!check1) {
    const check2 = await User.findOne({
      username: identity,
      password: credential,
    });
    if (!check2) {
      res.send({
        status: 401,
        message: "Invalid",
      });
    } else {
      res.send({
        status: 200,
        message: "Logged in",
        uuid: check2.uuid,
      });
    }
  } else {
    res.send({
      status: 200,
      message: "Logged in",
      uuid: check1.uuid,
    });
  }
});
router.post("/createotp", async (req, res) => {
  const random = Math.floor(Math.random() * 8999) + 1000;
  const { uuid } = req.body;
  const user = await User.findOne({ uuid });
  if (!user) {
    res.send({ status: 404, message: "User Not Found" });
  } else {
    user.otp = random;
    user.save();
    sendMail({
      subject: "OTP For DroneBuzz",
      people: user.email,
      notificationashtml: `<h2 style="color: purple">
      Your OTP for dronebuzz is here
      </h2>
      <hr color="#2977F5" />
      <h2>${random}</h2>`,
    });
    res.send("done");
  }
});
router.post("/confirmotp", async (req, res) => {
  const { uuid, otp } = req.body;
  if (otp < 0) {
    res.send({
      status: 400,
      message: "bad otp",
    });
  }
  const user = await User.findOne({ uuid });
  if (user.verified) {
    res.send({ status: 201, message: "Already Verified" });
  } else if (otp === user.otp) {
    user.verified = true;
    user.save();
    res.send({ status: 200, message: "verified" });
  } else {
    res.send({ status: 400, message: "Bad Request, wrong OTP" });
  }
});
module.exports = router;
