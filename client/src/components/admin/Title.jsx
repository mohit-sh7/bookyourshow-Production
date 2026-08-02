import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <h1
      className="
        text-3xl font-semibold tracking-wide 
        mb-6 
        text-white 
        drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]
        animate-fadeIn
      "
    >
      {text1}{' '}
      <span
        className="
          text-primary 
          font-bold 
          underline decoration-primary/80 decoration-4 
          underline-offset-4
          drop-shadow-[0_0_10px_rgba(127,0,255,0.6)]
        "
      >
        {text2}
      </span>
    </h1>
  )
}

export default Title
