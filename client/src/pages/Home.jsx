import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'

const Home = () => {
  return (
    <div className="w-full overflow-hidden">

      {/* Fullscreen Auto-Fade Hero Slider */}
      <HeroSection />

      {/* Featured Movies */}
      <div id="featured">
        <FeaturedSection />
      </div>

      {/* Trailer Section */}
      <div id="trailers">
        <TrailersSection />
      </div>

    </div>
  )
}

export default Home
