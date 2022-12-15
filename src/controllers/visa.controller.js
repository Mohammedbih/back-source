const Visa = require("../models/t_shirt.model");

const visaController = {};

// Create
visaController.post_create_visa=async(req,res,next) => {
  const {number}=req.body;
  const exist = await Visa.findOne({number});
  try {
    if(!exist){
      const newVisa = new Visa(req.body);
        await newVisa.save();
      return res.send({status:'Successed'})
    }
    
  } catch (err) {
    next(err)
  }
  const err = new Error(`Visa ${req.body.number} is already taken`);
  return next(err);
  
}

// Get

visaController.get_visa_by_id=async(req,res,next)=>{
  const id = req.params.id;
  if (!id) return res.status(404).send({ err: "Missing Data Parameter" });

  try {
    const visa = await getVisa(id);
    res.status(200).send(visa);
  } catch (e) {
    return next(e);
  }
};
const getVisa = async (id) => {
  const visa_exists = await Visa.find({ _id: id });

  if (!visa_exists) throw new Error("Visa Not Found");

  return visa_exists;
};

// Get List

visaController.get_list = async (req, res, next) => {
  const { limit = 10 } = req.query;
  try {
    const vList = await getAllVisa(limit);
    return res.status(200).send(vList);
  } catch (e) {
     next(e);
  }
};
const getAllVisa = async (n) => {
  return await Visa.find().limit(n);
};
// Delete
visaController.post_delete_by_id = (req, res, next) => {
  Visa.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      // redirct to list endpoint
    } else {
      console.log(err);
      return res.status(401).send({ err });
    }
  });
};

// Update
visaController.post_update_by_id = async (req, res, next) => {
  const id = req.params.id;
  const visa = new Visa({
    _id: id,
    number: req.body.number,
    serialcode: req.body.serialcode,
    password: req.body.password,
    valid: req.body.valid
  });
  Visa.findByIdAndUpdate(id, visa)
    .then(() => {
      res.status(201).json({
        message: "Visa updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};


module.exports = visaController;
