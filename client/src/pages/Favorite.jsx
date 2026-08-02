import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

const Favorite = () => {

  const {favoriteMovies} = useAppContext()

  return favoriteMovies.length > 0 ? (
    <div className='relative my-24 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[70vh]'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-lg font-medium text-heading-futuristic'>Your Favorite Movies</h1>
        <p className='text-sm text-text-muted'>{favoriteMovies.length} saved</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
        {favoriteMovies.map((movie)=> (
          <div key={movie._id} className="transform transition hover:scale-[1.03]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
      <p className='text-gray-400 mt-2'>Add movies to favorites to see them here.</p>
    </div>
  )
}

export default Favorite
