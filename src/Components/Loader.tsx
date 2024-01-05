import loader from '../assets/loadinsvg.svg'

export default function Loader() {
     return (
          <div className='flex items-center justify-center h-screen'><img src={loader} alt="loader" className='w-10 md:w-20' /></div>
     )
}
