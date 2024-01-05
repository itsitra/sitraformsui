import { Link, useNavigate } from "react-router-dom"

type AlretTypes = {
     message: string,
     link?: string,
     func?: string,
     closeModal?: Function
}
export default function AlertCard({ message, func, link, closeModal }: AlretTypes) {
     const navigate = useNavigate()

     function btn(e: React.MouseEvent<HTMLButtonElement>) {
          e.preventDefault()
          if (func === 'closewindow') {
               closeWindow()
          }
          if (func === 'closemodal') {
               closeModal!()
          }
     }

     function closeWindow(): void {
          if (document.referrer === "https://api.razorpay.com/") {
               console.log(window.history.length)
               navigate(`/event/${sessionStorage.getItem('eventlink')}`)
          } else {
               window.history.back()
          }
     }
     return (
          <div className="flex items-center justify-center h-screen p-10">
               <div className="alert shadow-lg md:w-1/4">
                    <div>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         <span>{message}</span>
                    </div>
                    <div className="flex-none">
                         {/* <button className="btn btn-sm btn-ghost">Deny</button> */}
                         {link !== undefined && <Link to={'/'}>Okay</Link>}
                         {func === 'closemodal' || func === 'closewindow' ? <button className="btn btn-sm btn-primary" onClick={(e) => btn(e)}>Okay</button> : <button className="btn btn-sm btn-primary"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         </button>}
                    </div>
               </div>
          </div>
     )
}
