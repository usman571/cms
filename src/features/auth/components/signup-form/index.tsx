'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import {
  createUserFormSchema,
  UserFormValues
} from './schema';
import axios from 'axios';

interface SignupFormProps {
  switchToLogin: () => void;
}

const signupWithServer = async (body: UserFormValues): Promise<boolean> => {
  const url = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}api/auth/signup`;

  try {
    await axios.post(url, body);
    toast.success('User signed up successfully');
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError =
        error.response?.data?.message || 'An unexpected error occurred';
      toast.error(
        Array.isArray(serverError) ? serverError.join(', ') : serverError
      );
    } else {
      toast.error('Error while creating user');
    }
    return false;
  }
};

export default function SignUpForm({ switchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = createUserFormSchema();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'Student'
    }
  });

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    const isSuccessful = await signupWithServer(data);
    setLoading(false);
    if (isSuccessful) {
      form.reset();
      switchToLogin();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Username"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Password"
                    disabled={loading}
                    className="pr-10"
                    {...field}
                  />
                  {showPassword ? (
                    <EyeIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeOffIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} className="ml-auto w-full" type="submit">
          Sign up
        </Button>
      </form>
    </Form>
  );
}