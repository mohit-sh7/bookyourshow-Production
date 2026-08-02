import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {

  const { nextUrl } = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate('/' + nextUrl)
      },800)
    }
  },[])

  return (
    <div className='flex justify-center items-center h-[60vh]'>
        <div className='relative'>
          <div className='absolute -inset-1 rounded-full blur-[12px] bg-gradient-to-r from-[rgba(127,0,255,0.6)] via-[rgba(240,0,255,0.4)] to-[rgba(0,240,255,0.4)] animate-spin-slow' />
          <div className='rounded-full h-14 w-14 border-4 border-t-primary border-gray-800 animate-spin z-10' />
        </div>
    </div>
  )
}

export default Loading
