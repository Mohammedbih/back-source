const Tshirt = require("../models/t_shirt.model");

const tShirtController = {};

// Create for admins
tShirtController.post_tShirt = async (req, res, next) => {
  try {
    if (req.user.type === "User") return next(new Error("Admin erea!"));
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

// Delete for admins
tShirtController.post_delete_by_id = async (req, res, next) => {
  try {
    if (req.user.type === "User") return next(new Error("Admin erea!"));
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
tShirtController.post_update_by_id = async (req, res, next) => {
  if (req.user.type === "User") return next(new Error("Admin erea!"));
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

module.exports = tShirtController;
