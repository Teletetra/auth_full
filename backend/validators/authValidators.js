import {z} from 'zod'

export const signupSchema=z.object({
  name:z.string().min(2,"Name must be at least 2 chars"),
  email:z.string().email("Invalid email format"),
  password:z.string().min(8," Password must be at least 8 chars")
})


// export const manualSanitize = (req, res, next) => {
//     const sanitizeObject = (obj) => {
//         for (let key in obj) {
//             // If a key starts with $, delete it (The NoSQL Injection trick)
//             if (key.startsWith('$')) {
//                 delete obj[key];
//             } else if (typeof obj[key] === 'object' && obj[key] !== null) {
//                 sanitizeObject(obj[key]); // Recursive check for nested objects
//             }
//         }
//     };

//     if (req.body) sanitizeObject(req.body);
//     if (req.params) sanitizeObject(req.params);
//     if (req.query) sanitizeObject(req.query);
    
//     next();
// };