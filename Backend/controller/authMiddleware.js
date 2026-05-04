const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. بنشوف هل التوكين موجود في الـ Headers؟
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // 2. بنفك التوكين ونشوفه صح ولا لا
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; 
        
        // 4. بنقوله "عدي" للخطوة اللي بعدها (الـ Controller)
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = { protect };