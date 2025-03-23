import { compareSync, hashSync } from "bcrypt"






export const generateHash = ( plaintext: string , salt = process.env.SALT) : string => {
    return hashSync(plaintext , parseInt(salt as string));
}

export const compareHash = ( plaintext: string , hashVale: string) : boolean => {
    return compareSync(plaintext , hashVale );
}


