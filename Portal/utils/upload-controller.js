const s3 = require("../config/aws-s3/s3.config.js");

const doUpload = (key, file) => {
  try {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Key = key;
    params.Body = file.buffer;
    const s3upload = s3Client.upload(params).promise();
    return s3upload;
  } catch (err) {
    console.log(err.toString());
  }
};
module.exports = {
  doUpload: doUpload,
};
