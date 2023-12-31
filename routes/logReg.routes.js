const router = require('express').Router()
const logRegController = require('../controller/logReg.controller')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'./public/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + 'Anupam_Mishra' + uniqueSuffix + path.extname(file.originalname))
    }
})

const uploads = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } 
        

         else {
            cb(null, false);
            return cb(new Error('only jpg, jpeg, png are allowed'))
        }
    },

})


router.get('/welcome',logRegController.welcomeStatus)
router.post('/register',uploads.single('image'),logRegController.register)
router.post('/login',logRegController.login)
router.get('/dashboard', logRegController.userAuth,logRegController.dashboard)
router.get('/logout',logRegController.logout)

module.exports = router