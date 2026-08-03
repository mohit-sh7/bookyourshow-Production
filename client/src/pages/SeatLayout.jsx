import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])

  const { axios, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats")
    }
    if (occupiedSeats.includes(seatId)) {
      return toast('This seat is already booked')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-1.5 sm:gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm rounded border border-primary/60 cursor-pointer shrink-0
               ${selectedSeats.includes(seatId) ? "bg-primary text-white scale-105 shadow-lg" : "bg-transparent"} 
               ${occupiedSeats.includes(seatId) ? "opacity-40 line-through cursor-not-allowed" : ""}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const bookTickets = async () => {
    try {
      if (!user) return toast.error('Please login to proceed')

      if (!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats');

      const { data } = await axios.post("/api/booking/create", {
        showId: selectedTime.showId,
        selectedSeats,
      });
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong, please try again")
    }
  }

  useEffect(() => {
    getShow()
  }, [id])

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats()
    }
  }, [selectedTime])

  if (!show) return <Loading />

  const timings = show.dateTime?.[date];

  if (!timings) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-3'>
        <p className='text-gray-300'>No showtimes found for this date.</p>
        <a href={`/movies/${id}`} className='btn-neon px-6 py-2'>Back to movie</a>
      </div>
    )
  }

  return (
    <div className='flex flex-col md:flex-row px-4 sm:px-6 md:px-16 lg:px-40 pt-28 md:pt-48 pb-10 gap-6 md:gap-8'>
      {/* Available Timings */}
      <div className='w-full md:w-72 bg-primary/8 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-28 glass-card'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-4 space-y-2 px-4'>
          {timings.map((item) => (
            <div key={item.time} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-4 py-2 w-full rounded-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white shadow-lg" : "hover:bg-primary/12"}`}>
              <ClockIcon className="w-4 h-4" />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>

        <div className='px-4 mt-4'>
          <p className='text-xs text-gray-400'>Legend</p>
          <div className='grid grid-cols-3 sm:flex sm:gap-3 gap-y-2 mt-2 items-center'>
            <div className='flex items-center gap-1.5'>
              <div className='w-4 h-4 rounded bg-primary shrink-0' />
              <span className='text-xs'>Selected</span>
            </div>
            <div className='flex items-center gap-1.5 sm:ml-3'>
              <div className='w-4 h-4 rounded bg-transparent border border-primary/30 shrink-0' />
              <span className='text-xs'>Available</span>
            </div>
            <div className='flex items-center gap-1.5 sm:ml-3'>
              <div className='w-4 h-4 rounded bg-gray-600 opacity-50 shrink-0' />
              <span className='text-xs'>Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-2'>
        <BlurCircle top="-80px" left="-80px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className='text-xl sm:text-2xl font-semibold mb-4 text-heading-futuristic text-center'>Select your seat</h1>

        <div className="w-full max-w-3xl glass-card p-3 sm:p-6 rounded-xl text-center overflow-hidden">
          <img src={assets.screenImage} alt="screen" className="mx-auto mb-2 w-full max-w-xs sm:max-w-sm" />
          <p className='text-gray-400 text-sm mb-4'>SCREEN SIDE</p>

          <div className='flex flex-col items-center mt-6 text-xs text-gray-300 w-full overflow-x-auto'>
            <div className='min-w-max'>
              <div className='grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-2 mb-6 w-full justify-items-center'>
                {groupRows[0].map(row => renderSeats(row))}
              </div>

              <div className='grid grid-cols-2 gap-8 sm:gap-12 w-full justify-items-center'>
                {groupRows.slice(1).map((group, idx) => (
                  <div key={idx}>
                    {group.map(row => renderSeats(row))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4'>
            <div className='text-left'>
              <p className='text-sm text-gray-300'>Selected Seats</p>
              <p className='font-medium break-words'>{selectedSeats.length ? selectedSeats.join(", ") : "None"}</p>
            </div>

            <div className='flex items-center gap-3'>
              <button onClick={() => { setSelectedSeats([]) }} className='btn-neon-secondary px-4 py-2 flex-1 md:flex-none'>Clear</button>
              <button onClick={bookTickets} className='btn-neon px-4 py-2 flex items-center justify-center gap-2 flex-1 md:flex-none'>
                Checkout
                <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout