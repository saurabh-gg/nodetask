const router = require('express').Router();
const userController =require('../controller/userController')

router.get('/', userController.getAllUsers)
router.post('/',userController.saveUsers)

module.exports =router;