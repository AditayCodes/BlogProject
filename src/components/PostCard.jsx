import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from "react-router-dom"


function PostCard({$id, title, featuredImage}) {
  return (
      <Link to={`/post/${$id}`}>
          <div className='w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col'>
              <div className='w-full mb-4 flex-shrink-0'>
                  <img src={appwriteService.getFilePreview(featuredImage)}
                      alt={title} className='rounded-xl w-full h-48 object-cover' />
                  
              </div>
              <h2
                  className='text-lg md:text-xl font-bold text-gray-800 flex-grow'
              >
                  {title}
              </h2>
          </div>
      </Link>
  )
}

export default PostCard