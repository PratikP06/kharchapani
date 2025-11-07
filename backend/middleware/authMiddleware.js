    import jwt from "jsonwebtoken";

    export const verifyToken = (req , res , next)=>{

        try {
            
        const token = req.cookies.token;


        if(!token){
            res.status(403).json({
                message : "Invalid request"
            })
        }

        

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = decoded;

        next();

        } catch (error) {
            console.error(error)
            res.status(403).json({ message: "Invalid or expired token" });
        }
    }

