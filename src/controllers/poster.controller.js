const { Error } = require("mongoose");
const Poster = require("../models/poster.model");
const Review = require("../models/review.model");

const posterController = {};

// Create for admin
posterController.post_poster = async (req, res, next) => {
  if (!req.user.isAdmin) return next(new Error("Admin area!"));
  const newPoster = new Poster(req.body);
  console.log("newPoster", newPoster);

  try {
    const newPoster = new Poster(req.body);
    console.log("newPoster", newPoster);
    const Poster = await newPoster.save();
    return res.send({ Poster });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

// Get
posterController.get_poster = async (req, res, next) => {
  const id = req.params.id;

  if (!id) return res.status(404).send({ err: "Missing Data Parameter" });

  try {
    const poster = await getPoster(id);
    res.status(200).send(poster);
  } catch (e) {
    return next(e);
  }
};
const getPoster = async (id) => {
  const poster_exists = await Poster.find({ _id: id });

  if (!poster_exists) throw new Error("Posters Not Found");

  return poster_exists;
};

// iam here

// Get List
posterController.get_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const pList = await getAllPoster(limit);
    return res.status(200).send(pList);
  } catch (e) {
    next(e);
  }
};
const getAllPoster = async (n) => {
  return await Poster.find().limit(n);
};

// Delete
posterController.post_delete_by_id = (req, res, next) => {
  if (!req.user.isAdmin) return next(new Error("Admin area!"));
  Poster.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      // redirct to list endpoint
    } else {
      console.log(err);
      return res.status(401).send({ err });
    }
  });
};

// Update
posterController.put_update_by_id = async (req, res, next) => {
  if (!req.user.isAdmin) return next(new Error("Admin area!"));
  const id = req.params.id;
  const poster = new Poster({
    _id: id,
    size: req.body.size,
    name: req.body.name,
    color: req.body.color,
    type: req.body.type,
    stock: req.body.stock,
    description: req.body.description,
    price: req.body.price,
    img: req.body.img,
  });
  Poster.findByIdAndUpdate(id, poster)
    .then(() => {
      res.status(201).json({
        message: "Poster updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Review by id
posterController.post_review_by_id = async (req, res, next) => {
  const poster = await Poster.findById(req.params.id);
  const { rating, comment } = req.body;

  if (poster) {
    const alreadyReviewed = poster.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Poster already Reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    try {
      poster.reviews.push(review);
      poster.no_of_reviews = poster.reviews.length;
      poster.rating =
        poster.reviews.reduce((acc, item) => item.rating + acc, 0) /
        poster.reviews.length;
      await poster.save();
      res.status(201).json({ message: "Review Added" });
    } catch (err) {
      next(err);
    }
  }
};

// Review get by id
posterController.get_poster_review_by_id = async (req, res, next) => {
  const poster = await Poster.findById(req.params.id);

  if (!poster) {
    return next(new Error("Not Found"));
  }
  return res.status(200).send({
    reviews: poster.reviews,
  });
};

module.exports = posterController;
