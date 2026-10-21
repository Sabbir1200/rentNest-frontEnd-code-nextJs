import React from 'react';
import RegisterForm from '../_components/registerForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Are you New !</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your credentials to access your account
          </p>
        </div>

       
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;