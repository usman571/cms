import * as z from 'zod';

// Define the role enum
const UserRole = z.enum(['Student', 'Teacher', 'Parent', 'Admin']);

export const createUserFormSchema = () => {
  return z.object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(30, { message: 'Username cannot exceed 30 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores'
      }),

    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(5, { message: 'Email must be at least 5 characters long' })
      .max(50, { message: 'Email cannot exceed 50 characters' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(50, { message: 'Password cannot exceed 50 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter'
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter'
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message:
          'Password must contain at least one special character (@$!%*?&#)'
      }),

    role: UserRole.refine(
      (val) => ['Student', 'Teacher', 'Parent', 'Admin'].includes(val),
      {
        message:
          'Please select a valid role: Student, Teacher, Parent, or Admin'
      }
    )
  });
};

// Export type for form values
export type UserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>;

// Export the role type separately if needed
export type UserRoleType = z.infer<typeof UserRole>;
