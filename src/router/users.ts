import express from 'express';

import { getAllusers ,deleteUser, updateUser} from '../controllers/users';
import { isAuthenticated,isOwner } from '../middlewares';

export default (router:express.Router) => {
    router.get('/users',isAuthenticated,getAllusers);
    router.delete('/users/:id',isAuthenticated,isOwner,deleteUser);
    router.patch('/users/:id',isAuthenticated,isOwner,updateUser);
}
