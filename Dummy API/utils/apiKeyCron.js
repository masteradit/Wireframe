const cron = require("node-cron");

const { apikey } = require("../models/api-key");

const apiKeyPerMin = cron.schedule("* * * * *", async () => {
  let dateNow = new Date().toISOString();
  console.log("CRON JOB: rpm -->", dateNow);
  await apikey.updateMany(
    {},
    {
      $set: {
        requestsPerMin: 0,
      },
    }
  );
});

module.exports = {
  apiKeyPerMin,
};
