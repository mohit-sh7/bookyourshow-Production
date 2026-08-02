import React, { useRef, useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateSelect = ({ dateTime, id }) => {

    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const [selected, setSelected] = useState(null)

    // Parse "YYYY-MM-DD" as local date, avoiding UTC-shift bugs
    const parseLocalDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(year, month - 1, day)
    }

    const onBookHandler = () => {
        if (!selected) {
            return toast.error('Please select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        window.scrollTo(0, 0)
    }

    const scrollByAmount = (amount) => {
        scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
    }

  return (
    <div id='dateSelect' className='pt-30'>
      <div className='relative  p-6 bg-[rgba(16,10,26,0.5)] border border-primary/12 rounded-2xl glass-card'>
        <BlurCircle top="-90px" left="-90px"/>
        <BlurCircle top="90px" right="0px"/>
        <div className='flex items-center justify-between flex-wrap gap-6'>
          <div>
            <p className='text-lg font-semibold'>Choose Date</p>
            <div className='flex items-center gap-4 text-sm mt-4'>
                <ChevronLeftIcon
                  width={24}
                  onClick={() => scrollByAmount(-150)}
                  className='cursor-pointer shrink-0'
                  aria-label='Scroll dates left'
                />
                <div
                  ref={scrollRef}
                  className='flex md:max-w-lg gap-4 overflow-x-auto scroll-smooth no-scrollbar'
                >
                    {Object.keys(dateTime).map((date) => {
                        const parsed = parseLocalDate(date)
                        return (
                            <button
                              onClick={() => setSelected(date)}
                              key={date}
                              className={`flex flex-col items-center justify-center h-14 w-14 aspect-square shrink-0 rounded cursor-pointer transition-all ${selected === date ? "bg-primary text-white shadow-lg" : "border border-primary/40 bg-transparent"}`}
                            >
                                <span className='text-sm font-medium'>{parsed.getDate()}</span>
                                <span className='text-xs text-gray-300'>{parsed.toLocaleDateString("en-US", { month: "short" })}</span>
                            </button>
                        )
                    })}
                </div>
                <ChevronRightIcon
                  width={24}
                  onClick={() => scrollByAmount(150)}
                  className='cursor-pointer shrink-0'
                  aria-label='Scroll dates right'
                />
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button onClick={() => setSelected(null)} className='btn-neon-secondary px-4 py-2'>Reset</button>
            <button onClick={onBookHandler} className='btn-neon px-6 py-2'>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateSelect