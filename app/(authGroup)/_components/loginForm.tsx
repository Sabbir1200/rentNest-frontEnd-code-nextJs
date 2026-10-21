"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect } from 'react'
import { loginAction } from '../_actions/authActions'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

// import { useRouter } from 'next/navigation'

const LoginForm = () => {
    // const searchParams = useSearchParams();
    // const redirectTo = searchParams.get("redirectedTo") ?? ""
    const [state, action, pending] = useActionState(loginAction, { success: false, statusCode: 0, message: "" })

    
    // const router = useRouter()
    useEffect(()=>{
        if(!state) return;
        
        // if(state.success){
        //     toast.success(state.message || "Login successfully")
        //     // router.push("/dashboard")
        // }
        if(!state.success){
            toast.error(state.message || "Login failed")
        }

    },[state])
  return (
   <form action={action} className='space-y-4'>
    <Card className='p-5 space-y-4'>
        <Input name='email' type="email" placeholder='Enter Your Email' required/>
        <Input name='password' type='password' placeholder='Enter Your Password' required/>
        <Button type='submit'>
            {
                pending ? "Submitting" : "LogIn"
            }
        </Button>
        <label className='text-sm text-gray-500'>Don&apos;t have an account? <a href="/register" className='text-blue-500'>Register</a></label>
    </Card>
   </form>
  )
}

export default LoginForm