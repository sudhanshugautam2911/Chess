import { Link } from "react-router"

const Landing = () => {
    return (
        <div className='h-screen w-full flex flex-col md:flex-row items-center justify-center max-md:space-y-6 bg-backgroundColor  md:p-12 '>
            <div className='md:w-1/2 flex flex-col items-center justify-center'>
                <h1 className='md:hidden block text-4xl text-white font-bold pb-4'>Play Chess Online</h1>
                <img src='./chessboard.jpg' alt="chessboard" className='w-[70%]' />
            </div>
            <div className='md:w-1/2 md:space-y-10'>
                <h1 className='hidden md:block text-4xl md:text-6xl text-white font-bold'>Play Chess Online</h1>
                <div className="flex flex-col max-md:items-center">
                    <Link to="/game">
                        <button className='px-9 md:px-24 py-3 rounded-md text-xl md:text-2xl font-bold bg-primary text-white border-b-4 border-secondary'>Play Online</button>
                    </Link>
                    <p className='text-gray-300 pt-3 font-bold text-sm'>Click on the above button to start a live match now.</p>
                </div>
            </div>
        </div>
    )
}

export default Landing