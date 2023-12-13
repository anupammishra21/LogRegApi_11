const userModel = require('../model/logReg.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mailer = require('../helper/mailer')

class logRegController{

    // show welcome status 
async welcomeStatus(req,res){
    try{
        res.status(200).json({
            mesage:"welcome Buddy "
        })

    }catch(err){
        throw err
    }

}

//  authentication section 

async userAuth(req,res,next){
    try{
        if(!_.isEmpty(req.user)){
            next()
        }

        else{
            res.status(400).json({
                msg:"UnauthoriZed User.. Plz Login",
                data:[]

            })
        }

    }catch(err){
        throw err
    }
}

// method  user Registration 

async register(req,res){
    try{
        if(_.isEmpty(req.body.name)){
            return res.status(400).json({
                message:"Name is required",
                data:[]
            })
        }

        if(_.isEmpty(req.body.email)){
            return res.status(400).json({
                message:"Eamil is required",
                data:[]
            })
        }

        if(_.isEmpty(req.body.age)){
            return res.status(400).json({
                message:"age is required",
                data:[]
            })
        }

        if(_.isEmpty(req.body.password)){
            return res.status(400).json({
                message:"password is required",
                data:[]
            })
        }

        if(_.isEmpty(req.body.confirmPassword)){
            return res.status(400).json({
                message:"ConfirmPassword is required",
                data:[]
            })
        }

        let isEmailExist = await userModel.findOne({email:req.body.email})

        if(!_.isEmpty(isEmailExist)){
            return res.status(400).json({
                message:"This Email is Already Exist ",
                data:[]
            })
        }

        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).json({
                message:"password and confirm password is does not matching ",
                data:[]
            }) 
        }

        req.body.password = bcrypt.hashSync(req.body.password)

        req.body.image = req.file.filename

        let saveData = await userModel.create(req.body)

        if (!_.isEmpty(saveData) && saveData._id) {
            let is_email_send = await mailer.sendMail(process.env.EMAIL,req.body.email,'email submitted',`hiw ${req.body.name} your 
            registration has sucessfully done `)
            // console.log("Email sending sms ",is_email_send);

            res.status(200).json({
                message:" Your registration has been sucessfully completed ",
                data:saveData
            })
            
        }else{

            res.status(400).json({
                message:" something went wrong ",
                data:[]
            })

        }
        
    }catch(err){
        throw err
        
    }

}


//  method User Login 

async login(req,res){
    try{
        if(_.isEmpty(req.body.email)){
            res.status(400).json({
                message:"Email is Required",
                data:[]

            })
        }

        if(_.isEmpty(req.body.password)){
            res.status(400).json({
                message:"password is Required",
                data:[]

            })
        }


        let email_exist = await userModel.findOne({email:req.body.email})

        if(_.isEmpty(email_exist)){

            res.status(400).json({
                message:"email does not exist with this account",
                data:[]
            })
        }

        else{
            const hashPassword = email_exist.password
            if(bcrypt.compareSync(req.body.password,hashPassword)){
                let token = jwt.sign({
                    id:email_exist._id,
                },
                'abcdefg',
                {expiresIn:"2D"})

                res.cookie('userToken',token)
                res.status(200).json({
                    message:"Login Sucessfull"
                })
            }else{
                res.status(400).json({
                    message:"Bad Credentials "
                })
            }
        }
    }catch(err){
        throw err
    }

}


//  User Dashboard Section 

async dashboard(req,res){
    try{
        if(!_.isEmpty(req.user)){
            let loginUser = await userModel.findOne({id:req.user._id})
            res.status(200).json({
                message:` welcome ${loginUser.name}`
            })
        }else{
            res.status(401).json({
                messgae:'Plz Login',
                data:[]
            })
        }
    



    }catch(err){
        throw err 
    }
    

}

// logout section 

async logout(req,res){
    try{
        res.clearCookie('userToken')
        res.status(200).json({
            message:"Logged out",
            data:[]
        })

    }catch(err){
        throw err
    }

}










}

module.exports = new logRegController()