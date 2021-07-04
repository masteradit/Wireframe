const { institution } = require("../models/institutions");

const fetchInstitutions = async (req, res) => {
  try {
    const results = await institution.find({});
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const fetchInstitutionDetails = async (req, res) => {
  try {
    const results = await institution.findById(req.params.institutionId);
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

module.exports = {
  fetchInstitutions,
  fetchInstitutionDetails,
};
