import {Router} from 'express'

import AuthController from '../controller/AuthController.js';
import authMiddleware from '../middleware/authmiddleware.js';
import ChatController from '../controller/ChatsController.js';
const routes = Router();

//User Routes

routes.post('/register',AuthController.register)
routes.post('/login',AuthController.login)
routes.get('/all-users',AuthController.getAllUser)
routes.get('/verify/user',authMiddleware,AuthController.verifyUser)

//Chat Routes

routes.post('/new/chat',authMiddleware,ChatController.generateChatCompletion)
routes.get('/get/send/chat',authMiddleware,ChatController.SendChattoUser)
routes.delete('/delete/chat',authMiddleware,ChatController.deleteUser)

export default routes