import React from 'react'

function MovieCard({ allMovieData, loading }) {
    return (
        <div>
            <div className="main flex flex-wrap justify-center items-center py-5 lg:px-10 md:px-5 px-4">
                {allMovieData.map((item, index) => {
                    const { Title, Year, Poster } = item;
                    return (
                        <div className='child p-2 lg:w-1/4 md:w-1/2 w-full'>
                            <div className='sub_child bg-gray-400 rounded-2xl shadow-md overflow-hidden'>
                                <img src={Poster}
                                alt="Movie Poster" className='w-full h-auto rounded-t-2xl mb-2' />
                                <div className='p-4'>
                                    <h2 className='text-xl font-bold mb-2'>{Title}</h2>
                                    <p className='text-gray-600'>{Year}</p>
                                    
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MovieCard;
