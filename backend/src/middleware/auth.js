import jwt from "jsonwebtoken";
// middleware para verificar el token 

const authMiddleware = async (req, res, next) => {
    try {
        console.log("TOKEN:", req.cookies.token);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        // extraemos el token
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ mensaje: 'No se proporcionó token' });
        }
        // verificar el token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (error) {
        res.status(400).json({messaje:"Token no valido o expirado"})
    }
}

export default authMiddleware;
