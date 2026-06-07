import React from 'react'

const QuoteSection = ({title, children}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className=' space-y-3'>{children}</div>
    </div>
  )
}

export default QuoteSection
