import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function landing() {
  const navigate = useNavigate()
  return (
    <div className='flex w-full flex-col justify-center h-full items-center min-h-screen text-white bg-gradient-to-r from-purple-500 to-purple-900'>
      <h1 className='text-3xl font-semibold font-serif text-wrap p-4 text-center '>
        Effortlessly gather testimonials from your customers.
      </h1>
      <p className='text-2xl font-serif text-wrap text-center p-8'>
        We understand that collecting testimonials can be challenging. That's why we created Testimonial. Within minutes, you can collect text and video testimonials from your customers, without needing a developer or website hosting.
      </p>
      <div className='flex justify-center items-center py-10 w-full'>
            <button className='rounded-xl bg-sky-500 text-white text-2xl p-4 hover:scale-110 transition-all' onClick={()=>navigate('/home')} >Try Free <small>now</small></button>
      </div>
    </div>
  )
}
