import jwt from 'jsonwebtoken'
import Client from '../models/Client.js'

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            Client.findOne({client_id:decoded.clientInfo.client_id},'-client_secret').then(client=>{
                req.client=client;
                next()
            });
        }
    )
}

export default verifyJWT