import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import CheckUserAuth from '../middlewares/authmiddle.js';


router.use('/changepassword',CheckUserAuth)
router.use('/loggedUser',CheckUserAuth)



router.post('/register',userController.userRegister)
router.post('/login',userController.userLogin)
router.post('/send-reset-password-email',userController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',userController.userPasswordReset)


//protected

router.post('/changepassword',userController.changeUserPassword)
router.get('/loggedUser',userController.loggedUser)





export default router