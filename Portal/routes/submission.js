const router = require("express").Router();
const { editSubmission } = require("../controller/submission");
const authenticate = require("../utils/auth");

const { multipleUpload } = require("../config/aws-s3/multer.config.js");

router.post(
  "/submission",
  authenticate.verifyUser,
  authenticate.isTeamMember,
  multipleUpload,
  editSubmission
);

module.exports = router;
