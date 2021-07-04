const { apikey } = require("../models/api-key");

const validateKey = async (req, res, next) => {
  try {
    const keyDetails = await apikey.findOne({ key: req.query.apikey });
    if (!keyDetails)
      return res.status(404).json({ message: "Inavlid API KEY" });
    if (keyDetails.requestsPerMin >= 5)
      return res.status(200).json({
        message: "Our standard API call frequency is 5 calls per minute.",
      });
    await apikey.updateOne(
      { key: req.query.apikey },
      { $inc: { requestsPerMin: 1, totalRequests: 1 } }
    );
    next();
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

module.exports = validateKey;
