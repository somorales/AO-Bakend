const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { verifyToken } = require("../middlewares/auth.middlewares");

// body del frontend
// {productId: ...}
// {kitId: ...}

router.post("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);

    if (req.body.productId) {
      user.favorites.products.push(req.body.productId);
    } else if (req.body.kitId) {
      user.favorites.kits.push(req.body.kitId);
    }

    const updateUser = await User.findByIdAndUpdate(req.payload._id, user, {
      new: true,
    });

    res.status(200).json(updateUser.favorites);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


router.delete("/products/:productId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);

    const favoritesFiltered = user.favorites.products.filter(
      (eachProductId) => eachProductId !== req.params.productId
    );
    user.favorites = favoritesFiltered;

    const updateUser = await User.findByIdAndUpdate(req.payload._id, user, {
      new: true,
    });

    res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
