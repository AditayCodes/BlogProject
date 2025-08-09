import React from 'react'
import { AppwriteImage } from "./index"
import {Link} from "react-router-dom"


function PostCard({$id, title, featuredImage}) {
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col'>
                <div className='w-full mb-4 flex-shrink-0'>
                    <AppwriteImage
                        fileId={featuredImage}
                        alt={title}
                        className='rounded-xl w-full h-48 object-cover'
                        fallbackClassName='rounded-xl w-full h-48 bg-gray-200 flex items-center justify-center'
                        fallbackText='No Image Available'
                    />
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