const {
  fetchInstitutionDetails,
  fetchInstitutions,
} = require("../controller/institutions");
const validateKey = require("../utils/validateApiKey");

const router = require("express").Router();

router.get("/institutions", validateKey, fetchInstitutions);
router.get("/institution/:institutionId", validateKey, fetchInstitutionDetails);

module.exports = router;
