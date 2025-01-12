const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("Unauhtorized Request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).send("Unauhtorized Request");
    }

    const payload = jwt.verify(token, "secretkey123456");
    if (!payload) {
      return res.status(401).send("Unauhtorized Request");
    }
    req.userId = payload._id;
    next();
  } catch (e) {
    return res.status(401).send("Unauhtorized Request");
  }
};
