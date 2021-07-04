const { stock } = require("../models/stocks");
const fetchStocks = async (req, res) => {
  try {
    const results = await stock.find({});
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const fetchStockDetails = async (req, res) => {
  try {
    const results = await stock.findById(req.params.stockId);
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
module.exports = {
  fetchStocks,
  fetchStockDetails,
};
