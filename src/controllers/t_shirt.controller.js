const { Error } = require("mongoose");
const Tshirt = require("../models/t_shirt.model");

const tShirtController = {};

// Create for admins
tShirtController.post_tShirt = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return next(new Error("Admin area!"));
    const newTshirt = new Tshirt(req.body);
    console.log("newTshirt", newTshirt);
    const tShirt = await newTshirt.save();
    return res.send({ tShirt });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

// Get
tShirtController.get_tShirt_by_id = async (req, res, next) => {
  const id = req.params.id;

  if (!id) return res.status(404).send({ err: "Missing Data Parameter" });

  try {
    const t_shirt = await getTshirt(id);
    res.status(200).send(t_shirt);
  } catch (e) {
    return next(e);
  }
};
const getTshirt = async (id) => {
  const tshirt_exists = await Tshirt.find({ _id: id });

  if (!tshirt_exists) throw new Error("T-Shirt Not Found");

  return tshirt_exists;
};

// Get List
tShirtController.get_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const tList = await getAllTshirts(limit);
    return res.status(200).send(tList);
  } catch (e) {
    next(e);
  }
};
const getAllTshirts = async (n) => {
  return await Tshirt.find().limit(n);
};

// Get sub list with hody
tShirtController.get_hody_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const tList = await getHodyTshirts(limit);
    return res.status(200).send(tList);
  } catch (e) {
    next(e);
  }
};
const getHodyTshirts = async (n) => {
  const list = await Tshirt.find().limit(n);
  return list.filter((t_shirt) => t_shirt.tshirt_type === "Hody");
};

// Get sub list with Long Sleeve
tShirtController.get_long_sleeve_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const tList = await getLongSleeveTshirts(limit);
    return res.status(200).send(tList);
  } catch (e) {
    next(e);
  }
};
const getLongSleeveTshirts = async (n) => {
  const list = await Tshirt.find().limit(n);
  return list.filter((t_shirt) => t_shirt.tshirt_type === "Long-Sleeve");
};

// Get sub list with half sleeve
tShirtController.get_half_sleeve_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const tList = await getHalfSleeveTshirts(limit);
    return res.status(200).send(tList);
  } catch (e) {
    next(e);
  }
};
const getHalfSleeveTshirts = async (n) => {
  const list = await Tshirt.find().limit(n);
  return list.filter((t_shirt) => t_shirt.tshirt_type === "Half-Sleeve");
};

// Get printed list
tShirtController.get_printed_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const tList = await getPrintedTshirts(limit);
    return res.status(200).send(tList);
  } catch (e) {
    next(e);
  }
};
const getPrintedTshirts = async (n) => {
  const list = await Tshirt.find().limit(n);
  return list.filter((t_shirt) => t_shirt.type === "Printed");
};

// Get not printed list
tShirtController.get_not_printed_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const tList = await getNotPrintedTshirts(limit);
    return res.status(200).send(tList);
  } catch (e) {
    next(e);
  }
};
const getNotPrintedTshirts = async (n) => {
  const list = await Tshirt.find().limit(n);
  return list.filter((t_shirt) => t_shirt.type === "Not-Printed");
};

// Delete for admins
tShirtController.post_delete_by_id = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return next(new Error("Admin area!"));
    const result = await Tshirt.findByIdAndRemove(req.params.id);
    console.log(result);
    if (result != null)
      return res.status(200).send({
        result,
      });
    throw new Error("Not Found");
  } catch (e) {
    next(e);
  }
};

// Update
tShirtController.put_update_by_id = async (req, res, next) => {
  if (!req.user.isAdmin) return next(new Error("Admin area!"));
  const id = req.params.id;
  const _price = req.body.price;
  const t_shirt = new Tshirt({
    _id: id,
    name: req.body.name,
    color: req.body.color,
    type: req.body.type,
    price: _price > 100 ? _price : undefined,
    img: req.body.img,
  });
  Tshirt.findByIdAndUpdate(id, t_shirt)
    .then(() => {
      res.status(201).json({
        message: "T-Shirt updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
// Review Post
tShirtController.post_review_by_id = async (req, res, next) => {
  const tShirt = await Tshirt.findById(req.params.id);
  const { rating, comment } = req.body;

  if (tShirt) {
    const alreadyReviewed = tShirt.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      next(new Error(`T-Shirt already Reviewed from user ${req.user.name}`));
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    tShirt.reviews.push(review);
    tShirt.no_of_reviews = tShirt.reviews.length;
    tShirt.rating =
      tShirt.reviews.reduce((acc, item) => item.rating + acc, 0) /
      tShirt.reviews.length;
    await tShirt.save();
    res.status(201).json({ message: "Review Added" });
  } else {
    res.status(404);
    throw new Error("T-Shirt Not Found");
  }
};

// Review get by id
tShirtController.get_tshirt_review_by_id = async (req, res, next) => {
  const tShirt = await Tshirt.findById(req.params.id);

  if (!tShirt) {
    return next(new Error("Not Found"));
  }
  return res.status(200).send({
    reviews: tShirt.reviews,
  });
};
module.exports = tShirtController;
