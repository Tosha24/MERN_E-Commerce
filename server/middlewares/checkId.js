import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send("Invalid ID");
  }
  next();
}

export default checkId;