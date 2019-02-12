const {User} = require('./resolvers')
const jwt = require('jsonwebtoken');

const expiresIn = "1d";
const secret = "samplejwtiotaxi";
const tokenPrefix = "JWT";

const verifyToken = (token) => {
    try{
        console.log(token)
        const [prefix,recivedToken] = token.split(' ');
        let user = null;
        if(!recivedToken){
            throw new Error('No token provided');
        }
        if(prefix != tokenPrefix){
            throw new Error('Invalid head format')
        }

        jwt.verify(recivedToken,secret,(err,payload) => {
            if(err) {throw new Error("Invalid Token")}
            else{
                user = User.findById(payload.id).exec()
            }
        })

        if(!user){ throw new Error("User doesn't exist")}

        return user
    }catch(err){
        throw Error(err);
    }
}

module.exports = { verifyToken }