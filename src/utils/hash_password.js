/* 
creates a reusable hash function for passwords 
and creates a function to compare passwords based
on bcrypt encryption
*/

import bcrypt from "bcryptjs";

export default function hashPassword(password){
    return bcrypt.hashSync(password, 10); // generates a secure hash with a salt of 10
}

export default function compareHashedPassword(password, hashedPassword){
    return bcrypt.compareSync(password, hashedPassword);
}