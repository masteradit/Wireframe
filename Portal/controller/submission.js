const { Submission } = require("../models/submission");

const { File } = require("../models/file");
const { doUpload } = require("../utils/upload-controller");

const editSubmission = async (req, res) => {
  try {
    console.log(req.body)
    const { appName, description, github, attachments, isSubmitted, category } =
      req.body;
    let attachment = attachments ? attachments : [];
    const _id = req.query.teamId;
    const files = req.files;
    console.log(files.length)
    if (files.length > 0) {
      files.forEach(async (item) => {
        const randomID = Math.random();
        regex = new RegExp("[^.]+$");
        extension = item.originalname.match(regex);
        const newFile = new File({
          fileName: item.originalname,
          url:
            "https://aether-test.s3.amazonaws.com/teams/" +
            _id +
            "/" +
            randomID +
            item.originalname,
          type: extension[0],
          key: "teams/" + _id + "/" + randomID + item.originalname,
        });

        attachment.push(newFile);
        await doUpload(newFile.key, item);
      });
    }
    const updatedSubmission = await Submission.findOneAndUpdate(
      { teamId: _id },
      {
        $set: {
          appName: appName.trim(),
          description: description.trim(),
          category: category,
          github: github.trim(),
          attachments: attachment,
          isSubmitted: isSubmitted,
          submitTimestamp: isSubmitted ? new Date().toISOString() : null,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: updatedSubmission,
    });
  } catch (error) {
    console.log(error.toString());
    return res
      .status(500)
      .json({
        message: "Submission could not be edited.",
        error: error.toString(),
      });
  }
};

module.exports = {
  editSubmission,
};
