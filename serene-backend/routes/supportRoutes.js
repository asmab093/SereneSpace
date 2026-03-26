const express = require("express");
const router = express.Router();
const { getHotlines, getProfessionals ,addHotline,addProfessional} = require("../controllers/supportController");

router.get("/hotlines", getHotlines);
router.post("/hotlines", addHotline);

router.get("/professionals", getProfessionals);
router.post("/professionals", addProfessional); // 

module.exports = router;