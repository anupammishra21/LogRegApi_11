const mongoose = require('mongoose')
const schemae = mongoose.Schema

const logRegSchema = schemae({
    name:{type:String,require:true},
    email:{type:String,require:true},
    age:{type:Number,require:true},
    image: { type: String },
    password:{type:String,require:true},
    isDeleted:{type:Boolean,enum:[true,false],default:false}

},
{
    timestamps:true,
    versionkey:false

})

module.exports = mongoose.model('logRegApi10',logRegSchema)