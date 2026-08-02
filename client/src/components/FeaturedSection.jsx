import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { shows } = useAppContext()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44'>
      <div className='relative flex items-center justify-between pt-6 pb-4 overflow-hidden'>
        <BlurCircle top='-40px' right='-80px'/>
        <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
        <button onClick={() => navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
            View All
            <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/>
          </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6 items-stretch'>
        {shows.slice(0, 4).map((show) => (
            <div key={show._id} className='h-full transform transition hover:scale-[1.03]'>
              <MovieCard movie={show}/>
            </div>
        ))}
      </div>

      <div className='flex justify-center mt-8'>
        <button onClick={() => { navigate('/movies'); scrollTo(0, 0) }}
         className='px-8 py-2 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show more</button>
      </div>
    </div>
  )
}

export default FeaturedSection