import express from 'express';
import {get,merge} from 'lodash';

import { getUserBySesssionToken } from '../db/users';

export const isOwner = async (req:express.Request,res:express.Response,next:express.NextFunction) => {
    try{
        const  { id } = req.params;

        const currentUserId = get(req,'identity._id') as string;
        if(!currentUserId){
            return res.status(403).json({
                error:`no user with this is id : (${currentUserId})`
            })
        }
        
        if(currentUserId.toString()!==id) {
            return res.status(403).json({
                error:"access to delete other user denied"
            })
        }
        next();
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }
}
export const isAuthenticated = async (req:express.Request,res:express.Response,next:express.NextFunction) => {
    try{
        const sessionToken = req.cookies['MUDIT-AUTH'];

        if(!sessionToken){
            return res.status(403).json({
                error:"no session token matching"
            })
        }
        const existingUser = await getUserBySesssionToken(sessionToken);
        if(!existingUser){
            return res.status(403).json({
                error:`this user no longer exists`
            });
        }
        merge(req,{identity:existingUser});

        return next();
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
}