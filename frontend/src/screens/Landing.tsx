import { Link } from "react-router"

const Landing = () => {
    return (
        <div className='h-screen w-full flex flex-col md:flex-row items-center justify-center max-md:space-y-6 bg-backgroundColor p-12 '>
            <div className='md:w-1/2 flex justify-center'>
                <img src='./chessboard.jpg' alt="chessboard" className='w-[70%]' />
            </div>
            <div className='md:w-1/2 space-y-10'>
                <h1 className='text-4xl md:text-6xl text-white font-bold'>Play Chess Online</h1>
                <div>
                    <Link to="/game">
                        <button className='px-24 py-4 rounded-md text-xl md:text-2xl font-bold bg-primary text-white border-b-4 border-secondary'>Play Online</button>
                    </Link>
                    <p className='text-gray-300 pt-3 font-bold text-sm'>Click on the above button to start a live match now.</p>
                </div>
            </div>
        </div>
    )
}

export default Landing