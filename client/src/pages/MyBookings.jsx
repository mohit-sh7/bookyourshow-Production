import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { axios, user, image_base_url} = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () =>{
    try {
      const { data } = await axios.get("/api/user/bookings");
        if (data.success) {
          setBookings(data.bookings)
        }

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
    
  },[user])


  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-6 text-heading-futuristic'>My Bookings</h1>

      <div className="flex flex-col gap-4">
        {bookings.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20'>
            <p className='text-gray-400'>No bookings yet. Explore shows and book your seats.</p>
            <Link to="/movies" className='btn-neon mt-6'>Browse Shows</Link>
          </div>
        )}

        {bookings.map((item,index)=>(
          <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg p-3 max-w-4xl shadow-sm hover:shadow-md transition'>
            <div className='flex gap-3'>
              <img src={image_base_url + item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
              <div className='flex flex-col'>
                <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
              </div>
            </div>

            <div className='flex flex-col md:items-end md:text-right justify-between'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                {!item.isPaid && (
    <button
        onClick={async () => {
            const { data } = await axios.post(
                `/api/booking/retry-payment/${item._id}`
            );

            if (data.success) {
                window.location.href = data.url;
            }
        }}
        className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full"
    >
        Retry Payment
    </button>
)}
              </div>
              <div className='text-sm'>
                <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
                <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
              </div>
              {item.isPaid && item.qrCode && (
  <button
    onClick={() => setSelectedTicket(item)}
    className="mt-4 rounded-lg bg-primary px-4 py-2"
  >
    View Ticket
  </button>
)}
            </div>
          </div>
        ))}
      </div>
      {selectedTicket && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="w-96 rounded-2xl border border-white/10 bg-[#111] p-6">
      <h2 className="mb-4 text-center text-2xl font-bold">
        QUICKSHOW
      </h2>

      <p className="mb-2">
        <strong>Movie:</strong>{" "}
        {selectedTicket.show.movie.title}
      </p>

      <p className="mb-2">
        <strong>Seats:</strong>{" "}
        {selectedTicket.bookedSeats.join(", ")}
      </p>

      <p className="mb-4">
        <strong>Amount:</strong> {currency}
        {selectedTicket.amount}
      </p>

      <div className="flex justify-center">
        <img
          src={selectedTicket.qrCode}
          alt="QR Code"
          className="h-48 w-48 rounded-lg"
        />
      </div>

      <button
        onClick={() => setSelectedTicket(null)}
        className="mt-6 w-full rounded-lg bg-red-500 py-2"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  ) : <Loading />
}

export default MyBookings
