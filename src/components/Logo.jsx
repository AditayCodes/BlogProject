import React from 'react'

function Logo({width= '100px'}) {
  return (
    <div style={{ width }} className="flex items-center gap-3">
      {/* Blog Icon - Pen/Writing Icon */}
      <div className="flex-shrink-0">
        <svg
          className="w-8 h-8 text-emerald-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>

      {/* Text */}
      <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap tracking-tight">
        <span className="text-black ">Blog</span>
        <span className="text-gray-900">Project</span>
      </h1>
    </div>
  )
}

export default Logo