const { fetchStocks, fetchStockDetails } = require("../controller/stocks");
const validateKey = require("../utils/validateApiKey");

const router = require("express").Router();

router.get("/stocks", validateKey, fetchStocks);
router.get("/stock/:stockId", validateKey, fetchStockDetails);

module.exports = router;
