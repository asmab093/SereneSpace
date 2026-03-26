const Hotline = require("../models/Hotline");
const Professional = require("../models/Professional");

// Get all hotlines
exports.getHotlines = async (req, res) => {
  try {
    const hotlines = await Hotline.find();
    res.status(200).json({ success: true, data: hotlines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all professionals (with optional search)
exports.getProfessionals = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    const professionals = await Professional.find(query);
    res.status(200).json({ success: true, data: professionals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- POST METHODS (For adding data via Hopscotch/Postman) ---

// Add a new Professional
exports.addProfessional = async (req, res) => {
  try {
    const newProfessional = new Professional(req.body);
    await newProfessional.save(); // 🔥 This triggers the Mongoose validation!
    res.status(201).json({ success: true, data: newProfessional });
  } catch (error) {
    // If validation fails, this returns the 400 error we want to see
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add a new Hotline
exports.addHotline = async (req, res) => {
  try {
    const newHotline = new Hotline(req.body);
    await newHotline.save();
    res.status(201).json({ success: true, data: newHotline });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
