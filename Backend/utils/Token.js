import jwt from "jsonwebtoken";

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT, { expiresIn: "3d" });
}
export default generateToken;
