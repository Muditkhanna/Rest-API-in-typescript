import express from 'express';
import { getUserByEmail,createUser } from '../db/users';
import {random,authentication} from '../helpers';

export const login = async (req:express.Request,res:express.Response) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.sendStatus(400)
        }

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

        const salt = random();
        const user = await createUser({
            email,
            username,
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