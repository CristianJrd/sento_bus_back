const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema
const UserSchema = new Schema({
  "name": {
    type: String,
    required: true
  },
  "lastname": {
    type: String,
    required: true
  },
  "email": {
    type: String,
    required: true,
    unique: true
  },
  "password": {
    type: String,
    required:true
  },
  "user_phone": {
    type: String
  },
  "avatar":{
    type: String
  },
  "nickname": {
    type: String
  },
  "is_admin": {
    type: Boolean,
    default: false
  },
  "is_inspector": {
    type: Boolean,
    default: false
  },
  "is_imt": {
    type: Boolean,
    default: false
  },
  "is_caja": {
    type: Boolean,
    default: false
  },
  "is_taller": {
    type: Boolean,
    default: false
  },
  "is_uva": {
    type: Boolean,
    default: false
  },
  "jefe_inspector": {
    type: Boolean,
    default: false
  },
  "administrativo":{
    type: Boolean,
    default: false
  },
  "is_capt":{
    type: Boolean,
    default: false
  },
  "finanzas":{
    type: Boolean,
    default: false
  },
  "jefe_administrativo":{
    type: Boolean,
    default: false
  },
  "admin_juridico":{
    type: Boolean,
    default: false
  },
  "admin_tecnico":{
    type: Boolean,
    default: false
  },
  "capacitador":{
    type: Boolean,
    default: false
  },
  "date_resp":{
    type: Boolean,
    default: false
  },
  "status": {
    type: Boolean,
    default: true
  }
},{collection:"User",timestamps:true});

UserSchema.pre('save',function(next){
    let user = this;
    if(!user.isModified('password')){ return next(); }

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
        if (err) return next(err);

        bcrypt.hash(user.password,salt,function(err,hash){
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
})

UserSchema.methods.comparePassword = function(candidatePassword,cb) {
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){ 
        cb(null,isMatch)
    })
}

module.exports = mongoose.model('User',UserSchema);