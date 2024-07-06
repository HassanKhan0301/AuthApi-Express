import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'

var CheckUserAuth = async (req,res,next)=>{

    let token
    const{authorization}= req.headers
    if (authorization && authorization.startsWith('Bearer')){
        try {
            //get token from header
            token = authorization.split(' ')[1]
            console.log('token',token);
            console.log('Authorization',authorization);



            //verify tokken
            const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY)

            //get user from token
            req.user = await userModel.findById(userID).select('-password')
            next()
            
        } catch (error) {
            console.log(error)
            res.send({" status": "failed","message":"UnAuthurize Dealer "})
            
        }
    }
    if(!token){
        res.status(401).send({"status":"failed" ,"message": "unautherized user,Non token"})
    }
}


export default CheckUserAuth