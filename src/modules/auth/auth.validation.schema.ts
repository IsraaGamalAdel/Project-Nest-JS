import { z } from 'zod';


export const createUserSchema = z.object({
    userName: z.string({message: 'user name is required'}).min(2).max(50),
    email: z.string().email(),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,}$/),
    confirmPassword: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,}$/),
    date: z.object({
        x:z.number()
    })
}).strict()
// .required()
// .deepPartial()  // optional field to not required to option the object
.passthrough()
.superRefine((value, ctx) => {
    if(value.password !== value.confirmPassword){
        ctx.addIssue({code:z.ZodIssueCode.custom, message:'password not match'});
    }
})


export type CreateSignUpDto = z.infer<typeof createUserSchema>;
