import mongoose  from "mongoose";
//schema design of user model
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    authentication:{
        password:{
            type:String,
            required:true,
            select:false,
        },
        salt:{
            type:String,
            select:false,
        },
        sessionToken:{
            type:String,
            select:false,
        },
    }
})

//making model of db
export const UserModel= mongoose.model('User',UserSchema);

//different CRUD functions for users

//for finding all users
export const getUsers = ()=> UserModel.find({});
//for finding user by email
export const getUserByEmail = (email:string)=>UserModel.findOne({email});
//for finding user by sessionTokem
export const getUserBySesssionToken=(sessionToken:string) =>UserModel.findOne({'authentication.sessionToken':sessionToken});
//finding user by Id
export const getUserById= (id:string)=>UserModel.findById(id);

//creating user in db
export const createUser = (values:Record<string,any>)=>new UserModel(values).save().then((user)=>user.toObject());

//deleting user in db
export const deleteUserById = (id:string)=>UserModel.findOneAndDelete({_id:id});

//updating user in db
export const updateUserById = (id:string,values:Record<string,any>)=>UserModel.findByIdAndUpdate(id,values);