import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>

      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px'/>
        <div className='mx-auto max-w-[960px] rounded-xl overflow-hidden glass-card'>
          <ReactPlayer url={currentTrailer.videoUrl} controls={true} width="100%" height="540px" className="mx-auto"/>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
        {dummyTrailers.map((trailer)=>(
            <div key={trailer.image} className='relative group cursor-pointer transform hover:scale-[1.02] transition' onClick={()=> setCurrentTrailer(trailer)}>
                <img src={trailer.image} alt="trailer" className='rounded-lg w-full h-40 md:h-60 object-cover brightness-75'/>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='p-2 rounded-full bg-[rgba(0,0,0,0.45)] backdrop-blur-sm'>
                    <PlayCircleIcon strokeWidth={1.6} className="w-10 h-10 text-white"/>
                  </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default TrailersSection
