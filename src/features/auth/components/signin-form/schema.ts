import * as z from 'zod';
export const createSignInFormSchema = () => {
  return z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().regex(/[a-z]/, {
      message: 'Password is requrired'
    })
  });
};

export type UserFormValues = z.infer<ReturnType<typeof createSignInFormSchema>>;
