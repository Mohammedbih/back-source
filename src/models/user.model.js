const mongoose = require("mongoose");
const bctypt = require("bcryptjs");
const Tshirt = require("./t_shirt.model");
const Poster = require("./poster.model");

const { Schema } = mongoose;

const UserSchema = Schema({
  name: { type: String, require: true },
  age: { type: Number },
  mobile: { type: String },
  visa_id: { type: mongoose.Schema.Types.ObjectId, ref: "Visa" },
  t_shirts_bought: [{ type: mongoose.Schema.Types.ObjectId, ref: "T-Shirt" }],
  adress: { type: String },
  email: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  password: { type: String, require: true },
  isAdmin: { type: Boolean, require: true, default: false },
  type: {
    type: String,
    enum: {
      values: ["User", "Admin"],
      message: "{VALUE} is not supported",
    },
    default: "User",
  },
  joined: { type: Date, default: new Date() },
  token: String,
  // carts: {type:[Tshirt.Schema || Poster.Schema]},
  carts_tshirt: {
    items: [
      {
        tshirtId: {
          type: mongoose.Types.ObjectId,
          ref: "T-Shirt",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },

  carts_poster: {
    items: [
      {
        posterId: {
          type: mongoose.Types.ObjectId,
          ref: "Poster",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
});

UserSchema.pre("save", async function (next) {
  //Check new account, or modified
  if (!this.isModified("password")) {
    return next();
  }

  //Encrypt pass
  try {
    const salt = await bctypt.genSalt(12);
    const hash = await bctypt.hash(this.password, salt);
    this.password = hash;

    next();
  } catch (e) {
    return next(e);
  }
});

UserSchema.methods.isPasswordMatch = function (password, hashed) {
  return bctypt.compareSync(password, hashed);
};

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.methods.addTshirtToCart = function (tshirt) {
  const cart = this.carts_tshirt;
  if (cart.items.length == 0) {
    cart.items.push({ tshirtId: tshirt._id, quantity: 1 });
    cart.totalPrice = tshirt.price;
  } else {
    const isExisting = cart.items.findIndex((objInItems) => {
      return (
        new String(objInItems.tshirtId).trim() == new String(tshirt._id).trim()
      );
    });
    console.log("isExistiong: ", isExisting);
    if (isExisting == -1) {
      cart.items.push({ tshirtId: tshirt._id, quantity: 1 });
      cart.totalPrice += tshirt.price;
    } else {
      existingtshirtInCart = cart.items[isExisting];
      existingtshirtInCart.quantity += 1;
      cart.totalPrice += tshirt.price;
    }
  }

  console.log("User in schema: ", this);
  return this.save();
};

UserSchema.methods.addPosterToCart = function (poster) {
  const cart = this.carts_poster;
  if (cart.items.length == 0) {
    cart.items.push({ posterId: poster._id, quantity: 1 });
    cart.totalPrice = poster.price;
  } else {
    console.log(poster)
    const isExisting = cart.items.findIndex((objInItems) => {
      return (
        (objInItems.posterId).toString().trim() ===
        (poster._id).toString().trim()
      );
    });
    console.log("isExistiong: ", isExisting);
    if (isExisting == -1) {
      cart.items.push({ posterId: poster._id, quantity: 1 });
      cart.totalPrice += poster.price;
    } else {
      existingposterInCart = cart.items[isExisting];
      existingposterInCart.quantity += 1;
      cart.totalPrice += poster.price;
    }
  }

  console.log("User in schema: ", this);
  return this.save();
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
