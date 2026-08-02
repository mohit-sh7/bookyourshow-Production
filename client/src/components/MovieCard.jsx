import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'

const FALLBACK_IMAGE = '/fallback-poster.jpg' // adjust to an actual asset in your project

const MovieCard = ({ movie }) => {

    const navigate = useNavigate()
    const { image_base_url } = useAppContext()

    const goToMovie = () => {
        navigate(`/movies/${movie._id}`)
        window.scrollTo(0, 0)
    }

    const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '—'
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '—'
    const genresText = movie.genres?.slice(0, 2).map(genre => genre.name).join(" | ") ?? ''
    const runtimeText = movie.runtime ? timeFormat(movie.runtime) : ''

  return (
    <div className='flex flex-col justify-between h-full p-3 bg-[rgba(16,10,26,0.6)] border border-primary/10 rounded-2xl hover:-translate-y-2 transition duration-300 shadow-sm w-[264px]'>
      <div className="relative">
        <img
          onClick={goToMovie}
          src={movie.backdrop_path ? image_base_url + movie.backdrop_path : FALLBACK_IMAGE}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
          alt={movie.title || 'Movie poster'}
          className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer'
        />

        <div className="absolute top-3 left-3 glass-card p-1.5 rounded-md flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-primary fill-primary"/>
          <span className='text-xs font-medium'>{rating}</span>
        </div>
      </div>

       <div className="mt-3">
         <p className='font-semibold mt-1 truncate'>{movie.title}</p>

         <p className='text-sm text-gray-400 mt-2'>
          {releaseYear}{genresText && ` • ${genresText}`}{runtimeText && ` • ${runtimeText}`}
         </p>
       </div>

       <div className='flex items-center justify-between mt-4 pb-1'>
        <button onClick={goToMovie} className='px-4 py-2 text-xs btn-neon'>Buy Tickets</button>

        <p className='flex items-center gap-1 text-sm text-gray-300 mt-1 pr-1'>
            <StarIcon className="w-4 h-4 text-primary fill-primary"/>
            {rating}
        </p>
       </div>
    </div>
  )
}

export default MovieCard