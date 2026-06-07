import React from 'react'

const BookingSkeleton = () => {
  return (
    <div className=' bg-white rounded-xl shadow-xl p-6 animate-pulse'>
    <div className=' h-6 bg-slate-200 rounded w-40 mb-6'></div>
      
      {[...Array(6)].map((_, i)=>(
        <div 
        key={i}
        className=' grid grid-cols-6 gap-4 py-3 border-b'
        >
            <div className='h-4 bg-slate-200 rounded col-span-1'></div>
            <div className='h-4 bg-slate-200 rounded col-span-1'></div>
            <div className='h-4 bg-slate-200 rounded col-span-1'></div>
            <div className='h-4 bg-slate-200 rounded col-span-1'></div>
            <div className='h-4 bg-slate-200 rounded col-span-1'></div>
            <div className='h-4 bg-slate-200 rounded col-span-1'></div>
        </div>

      ))}
    </div>
  )
}

export default BookingSkeleton
