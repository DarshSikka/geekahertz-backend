const User = require("../models/User");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const { sendMail } = require("./mail");
router.post("/buy/:slug", async (req, res) => {
  const slug = req.params.slug;
  const { uuid } = req.body;
  const usr = await User.findOne({ uuid });
  if (!usr) {
    res.send({ error: true });
  }
  const products = await axios.get(`${process.env.FLASK_APP}/products`);
  console.log(products);
  const product = products.data.products[slug];
  const url = await axios.get(
    `${process.env.FLASK_APP}/?name=${product.name}&price=${product.price}`
  );
  await sendMail({
    people: usr.email,
    notificationashtml: "<h1> Payment bill attached </h1>",
    subject: "Bill from dronebuzz",
    attachments: [
      {
        filename: "bill.png",
        path: `${process.env.FLASK_APP}/${url.data}`,
      },
    ],
  });
  res.send({ error: false });
});
module.exports = router;
