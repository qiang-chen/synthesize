//创造一个token并抛出

const jwt = require('jwt-simple')

module.exports.createToken=(user)=>{
    const token={
        time:new Date().getTime(),
        user:user
    };
 
    //token加密的key
   let secret = 'xxx';
 
    return jwt.encode(token, secret)
}