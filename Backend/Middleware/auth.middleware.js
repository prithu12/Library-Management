import JWT from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({success:false, message: 'Unauthorized access' });
        }
        const decoded=JWT.verify(token, process.env.JWT);
        req.user=decoded;
        next();


    }catch(error){
        return res.status(401).json({ message: 'Unauthorized access', error: error.message });
    }
}
export const adminMiddleware = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({success:false, message: 'Unauthorized access' });
        }
        const decoded=JWT.verify(token, process.env.JWT);
        if(decoded.role !== 'admin'){
            return res.status(403).json({success:false, message: 'Forbidden access' });
        }
        next();
    }catch(error){
        return res.status(401).json({ message: 'Unauthorized access', error: error.message });
    }
}