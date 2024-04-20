const express = require("express");
const userData = require("../db/models/userModel");
const router = express.Router();

const client = require("twilio")(process.env.Account_Sid, process.env.Auth_Token);
router.route("/").get(async (req, res) => {
  try {
    const users = await userData.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({
      msg: "unable to get data",
    });
  }
});

router.route("/createuser").post(async (req, res) => {
  try {
    const { name, quantity } = req.body;
    console.log(req.body);
    const user = await userData.create({ name, quantity });
    res.status(200).json({ user });
  } catch (error) {
    const errors = Object.values(error.errors).map((err) => err.message);
    res.status(400).json({
      msg: errors,
    });
  }
});

router.route("/user/:id").delete(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const deletedData = await userData.deleteOne({
      _id: id,
    });
    res.status(200).json({ deletedData });
  } catch (error) {
    res.status(400).json({ msg: "unable to delete user" });
  }
});

router.post("/sendmsg", async (req, res) => {
  try {
    const sentMsg = await client.messages.create({
      body: req.body.msg,
      from: "whatsapp:+14155238886",
      to: "whatsapp:" + req.body.to,
    });
    console.log(sentMsg);
    return res.status(200).json({ msg: sentMsg });
  } catch (error) {
    res.status(400).json({ msg: "unable to send msg" });
  }
});

router.route("/edit/:id").patch(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await userData.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    res.status(200).json({
      users: data,
    });
  } catch (error) {
    res.status(400).json({ msg: "unable to edit data" });
  }
});

router.route("/deleteall").delete(async (req, res) => {
  try {
    const deletedData = await userData.deleteMany({});
    res.status(200).json({ deletedData });
  } catch (error) {
    res.status(400).json({ msg: "unable to delete user" });
  }
});
module.exports = router;
