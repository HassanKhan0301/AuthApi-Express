import userModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class userContoller{
    static userRegister = async (req,res)=>{
        const {name,email,password,password_confirm,tc}= req.body;
         const user = await  userModel.findOne({email: email});
         if(user){
            res.send({" status": "failed","message":"Email Already Exist"})
         }else{
            if(name && email && password && password_confirm && tc ){
                if(password === password_confirm){
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hash = await bcrypt.hash(password,salt)
                        const newuser = new userModel({
                            name:name,
                            email:email,
                            password: hash,
                            tc:tc
                        })
                        await newuser.save()
                        const user = await userModel.findOne(
                            {email:email})
                            //jwt
                            const token = jwt.sign({userID:user._id},
                                process.env.JWT_SECRET_KEY,{expiresIn: '5d' })
                        
                        res.status(201).send({" status": "success",
                             "message":" registered success","token": token })
                    } catch (error) {
                        console.log(error)
                        res.send({" status": "failed","message":"Unable To register"})
                      
                    }

                }else{
                    res.send({" status": "failed","message":"Password Confirm Password Dosenot Match"})
                }

            }else{
                res.send({" status": "failed","message":"All Fields Are Required"})

            }
         }
    }
    static userLogin = async (req,res)=>{
        try {
            const {email,password}=req.body;
            if(email && password){
                const user = await  userModel.findOne({email: email});
                if(user !=null){
                    const match = await bcrypt.compare(password, user.password)
                    if((user.email === email) && match){
                            //jwt
                            const token = jwt.sign({userID:user._id},
                                process.env.JWT_SECRET_KEY,{expiresIn: '5d' })

                        res.send({" status": "sucess","message":"Login Sucess","token":token})

                    }else{
                        res.send({" status": "failed","message":"Email And password Dosenot Match"})
                    }

                }else{
                    res.send({" status": "failed","message":"You Are Not Register USer"})
                   
                }


            }else{
                res.send({" status": "failed","message":"All Fields Are Required"})
            }
        } catch (error) {
            console.log(error)
            res.send({" status": "failed","message":"Unable To Login "})
            
        }
    }

    static changeUserPassword = async(req,res)=>{
        const {password,password_confirm} = req.body
        if (password && password_confirm){
            if(password !== password_confirm){
                res.send({" status": "failed","message":"Confirm password dosent match "})
                

            }else{
                const salt = await bcrypt.genSalt(10)
                        const newhash = await bcrypt.hash(password,salt)
                      await userModel.findByIdAndUpdate(req.user._id,{$set:{
                        password: newhash
                      }})

                        res.send({" status": "success","message":"password change success "})
            }

        }else{
            res.send({" status": "failed","message":"All Fields Are Required"})

        }
    }
    static  loggedUser = async (req,res)=>{
        res.send({"user":req.user});
    }
    static sendUserPasswordResetEmail = async (req,res)=>{
        const {email} = req.body
        if(email){
           
            const user = await userModel.findOne({email: email})  
      

    if(user){
        const secret = user._id.toString() + process.env.JWT_SECRET_KEY
        const token = jwt.sign({userID: user._id},secret,{
            expiresIn: '15m' }) 
            const link =`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            console.log(link);
            res.send({" status": "success","message":"Password Reset Email  send ..check"})
        

      }else{
    res.send({" status": "failed","message":"Email Fields Are Does'nd exist"})
       }

        }else{
            res.send({" status": "failed","message":"Email Fields Are Required"})
        }
    }
    static userPasswordReset = async (req,res)=>{
        const  { password,password_confirm} = req.body
        const {id,token } = req.params
        console.log()
        const user = await userModel.findById(id)
        const new_secret = user._id.toString() + process.env.JWT_SECRET_KEY
        try {
        jwt.verify(token, new_secret)
        
        if(password && password_confirm){
            if(password !== password_confirm){
                res.send({" status": "failed","message":"Confirm password dosent match "})
            }else{
                const salt = await bcrypt.genSalt(10)
                const newhash  = await bcrypt.hash(password,salt)
              await userModel.findByIdAndUpdate(user._id, { $set:{
                password: newhash }})
              res.send({" status": "success","message":"Password Reset sucess"})
            }

        }else{
            res.send({" status": "failed","message":"All Fields Are Required"})

        }
            
        } catch (error) {
             console.log(error)
            res.send({" status": "failed","message":"Invalid Token"})
        }
    }
}


export default userContoller