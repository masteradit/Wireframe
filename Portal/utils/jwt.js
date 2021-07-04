const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const generateAuthJwt = async (user) => {
  try {
    const expire = "2d";
    const payload = {
      uid: user._id,
      name: user.name,
      email: user.email,
      iat: Date.now(),
    };
    const signedToken = await jwt.sign(payload, process.env.AUTH_SECRET, {
      expiresIn: expire,
    });
    return {
      token: "Bearer " + signedToken,
      expiresIn: expire,
    };
  } catch (error) {
    return error;
  }
};

const verifyJwtInUser = async (req, res, next) => {
  try {
    const bearerToken = req.headers["authorization"];
    // console.log("Token/" + " " + bearerToken);

    if (bearerToken) {
      const tokenArray = bearerToken.split(" ");
      const token = tokenArray[1];
      // console.log(tokenArray[1]);
      const userId = await jwt.verify(token, process.env.AUTH_SECRET);
      // console.log(userId);
      if (userId) {
        const userExists = await User.exists({
          _id: userId.uid,
        });
        if (userExists) {
          req.query.user = userId.uid;
          req.query.uid = userId.uid;
          next();
        } else {
          res.status(403).json({
            message: "No User exists with given web token Or Invalid Web Token",
          });
          // throw new Error('No User exists with given web token Or Invalid Web Token');
        }
      }
    } else {
      res.status(403).json({
        message: "no token recieved",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: error,
    });
  }
};

const decodeInviteJwt = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.AUTH_SECRET);
    if (decoded) return decoded;
  } catch (err) {
    console.log(err);
    return err;
  }
};
module.exports = {
  generateAuthJwt: generateAuthJwt,
  verifyJwtInUser: verifyJwtInUser,
  decodeInviteJwt: decodeInviteJwt,
};
