import React from 'react'
import { Outlet } from 'react-router-dom'

const LoginLayout = () => {
  return (
    <div className='flex flex-col min-h-[calc(100vh-3rem)]'>
      <header 
        className='sticky top-0 z-10 flex h-48 items-center gap-3 px-' 
        style={{
          backgroundImage:"url('/headerBanner.png')",
          backgroundSize: "cover",
          backgroundPosition : 'center'
        }}>
        
      </header>
      <div className='flex-1'>
        <Outlet/>
      </div>
    </div>

  )
}

export default LoginLayout