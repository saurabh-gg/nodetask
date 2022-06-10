const router = require('express').Router();
const userController =require('../controller/userController')

router.get('/', userController.getAllUsers)
router.post('/',userController.saveUsers)
router.put('/:id',userController.updateUser)

module.exports =router;