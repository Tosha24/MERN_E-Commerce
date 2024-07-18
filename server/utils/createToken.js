import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Ensure this is true if SameSite=None
    sameSite: 'None', // This allows the cookie to be sent in cross-domain contexts
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  return token;
};

export default generateToken;
