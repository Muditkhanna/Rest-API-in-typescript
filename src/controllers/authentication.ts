import express from 'express';
import { getUserByEmail,createUser } from '../db/users';
import {random,authentication} from '../helpers';

export const login = async (req:express.Request,res:express.Response) => {
    try{
        const {email,password} = req.body;
//if either of email or password is absent return 400
        if(!email || !password){
            return res.sendStatus(400);
        }
//get the user by email also fetch the authentication.salt and authentication.password as we have
//check the credentials of user logging in as are matching or not
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.sendStatus(400)
        }
//expected hash is the hash created with sha256 with current logging data of the user
//crypto algo which is made with salt and password pre-existing in the db as the particular user
//if what the newly gernerated hash and stored hash matches the credentials will be matched and login will be successful
        const expectedHash = authentication(user.authentication.salt,password);

        if(user.authentication.password!==expectedHash)
        {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken =authentication(salt,user._id.toString());
        
        await user.save();

        res.cookie('MUDIT-AUTH',user.authentication.sessionToken,{domain:'localhost', path:'/'});
        return res.status(200).json(user).end();
    }

    catch(err)
    {
        console.log(err);
        return res.sendStatus(400);
    }
}

export const register = async (req:express.Request,res:express.Response) =>{
    try{
        const {email,password,username} = req.body;
//if any of the following property is missing we return 400 status
        if(!email || !password || !username) return res.status(400).json({
            error:"missing property"
        })

        const existingUser = await getUserByEmail(email);
//if user already exists
        if(existingUser){
            return res.sendStatus(400);//cannot recreate already existing user 
        }
//create salt from random for hash generation
        const salt = random();
//create user in the datbase with username,email and password
        const user = await createUser({
            email,
            username,
//for authentication.password we will use the hash function to generate a random hash for every new user
            authentication:{
                salt,
                password:authentication(salt,password),
            }
        })
        return res.status(200).json(user).end();
    }catch(err){
        console.log(err);
    }
}