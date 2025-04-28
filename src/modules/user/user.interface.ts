import { GenderTypes, RoleTypes } from "src/DB/model/User.model";





export interface IUser {
        userName?: string;
    
        firstName: string;
    
        lastName: string;
    
        email: string;
    
        confirmEmail?: Date

        password: string
    
        address: string
    
        phone: string

        DOB?: Date
    
        gender: GenderTypes

        role: RoleTypes
    
        otp?: string

        changeCredentialTime?: Date

        createdAt?: Date

        updatedAt?: Date
        
}