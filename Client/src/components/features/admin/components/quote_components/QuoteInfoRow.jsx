import React from 'react'

const QuoteInfoRow = ({label, value}) => {
  return (
    <div className=' flex justify-between text-sm box-border pb-2 '>
    <span className=' text-slate-500'>{label}</span>
    <span className=' font-medium text-slate-800'>{value || "-"}</span>
    </div>
  )
}

export default QuoteInfoRow
