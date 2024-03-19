import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllusers= async (req:express.Request,res:express.Response)=>{
    try{
        const users = await getUsers();

        return res.status(200).json(users);
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }
};


export const deleteUser = async(req:express.Request,res:express.Response)=>{
    try{
        const {id} = req.params;

        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    }catch(err){
        console.log(err);
        return res.sendStatus(400)
    }
}

export const updateUser = async(req:express.Request,res:express.Response) => {
    try{
        const {id} = req.params;
        const {username} = req.body;
        const {email} = req.body;

        if(!username && !email) {
            return res.status(400).json({
                error:"give at least one parameter to update"
            });
        }
        const user = await getUserById(id);
        if(username)
        {
            user.username = username;
        }
        if(email)
        {
            user.email = email;
        }

        await user.save();

        return res.status(200).json(user).end();
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }
}