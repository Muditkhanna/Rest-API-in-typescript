import crypto from 'crypto';

//generates randomID function
export const random=()=>crypto.randomBytes(128).toString('base64');

const Secret = 'MUDIT-REST-API'

//function for generating hashing for sessionID for authentication

//it uses sha256 function by joining salt and password with / as (salt/password/saltpassword) with key as MUDIT-REST-API

export const authentication = (salt:string,password:string) =>{
    return crypto.createHmac('sha256',[salt,password].join('/')).update(Secret).digest('hex');
};

