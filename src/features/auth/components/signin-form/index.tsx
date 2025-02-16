
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
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  createSignInFormSchema,
  UserFormValues
} from './schema';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const callbackUrl = searchParams.get('callbackUrl');
  const error = searchParams.get('error');
  const [loading] = useState(false);
  const defaultValues = {
    email: '',
    password: ''
  };
  const formSchema = createSignInFormSchema();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const onSubmit = async (data: UserFormValues) => {
    sessionStorage.removeItem('toastShown');
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Important: Set this to false to handle redirect manually
      });

      if (result?.error) {
        toast.error('Invalid credentials');
        sessionStorage.setItem('toastShown', 'true');
      } else if (result?.ok) {
        // Successful login
        router.push('/dashboard'); // Or wherever you want to redirect
        router.refresh(); // Refresh to update the session
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    if (
      error === 'CredentialsSignin' &&
      !sessionStorage.getItem('toastShown')
    ) {
      toast.error('Invalid credentials');
      sessionStorage.setItem('toastShown', 'true');
    }
  }, [error]);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel> {"Email"}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={"Enter Email"}
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
                <FormLabel> {"Password"}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={!showPassword ? 'password' : 'text'}
                      placeholder={"Enter Password"}
                      disabled={loading}
                      className="pr-10" // Add padding-right for the icon
                      {...field}
                    />
                    {!showPassword ? (
                      <EyeOffIcon
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                        onClick={() => {
                          setShowPassword(true);
                        }}
                      />
                    ) : (
                      <EyeIcon
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                        onClick={() => {
                          setShowPassword(false);
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}

