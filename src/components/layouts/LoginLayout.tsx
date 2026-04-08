import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner";

const LoginLayout = () => {
  return (
    <div className='flex flex-col min-h-[calc(100vh-3rem)]'>
      <Toaster position="top-center" />
      <header 
        className='sticky top-0 z-10 flex h-32 items-center gap-3 px-6' 
        style={{
          backgroundImage:"url('/banner.gif')",
          backgroundSize: "cover",
          backgroundPosition : 'center'
        }}>
        <div className="absolute inset-0 bg-black/30" />
        <span className="relative z-10 w-full text-center text-5xl font-extrabold text-white">
          NamuWiki
        </span>
      </header>

      <div className='flex-1'>
        <Outlet/>
      </div>
    </div>
  )
}

export default LoginLayout