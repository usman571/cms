'use client';

import { useState } from 'react';
import SignInForm from '../signin-form';
import SignUpForm from '../signup-form';
// import UserAuthForm from '@/components/forms/user-auth-form';
// import SignupForm from '@/components/forms/SignupForm';

export default function AuthSwitcher() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isLogin ? "Login" : "Sign up"}
        </h1>
      </div>
      {isLogin ? (
        <SignInForm />
      ) : (
        <SignUpForm switchToLogin={switchToLogin} />
      )}
      <div className="text-center text-sm">
        {isLogin ? (
          <>
            do not have an account
            <button
              onClick={() => setIsLogin(false)}
              className="ml-1  text-primary"
            >
              sign Up
            </button>
          </>
        ) : (
          <>
            already have an account

            <button
              onClick={() => setIsLogin(true)}
              className="ml-1 text-primary"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
