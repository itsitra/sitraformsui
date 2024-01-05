// Imports
import { useState } from "react"
// Imports


// Types
type Cardprops = {
     event: {
          eventId?: string,
          eventtitle?: string,
          eventdescription?: string,
          eventVenue?: string,
          mfees?: string,
          nmfees?: string,
          eventduration?: string,
          eventStartDate?: string,
          eventEndDate?: string,
          regstartdate?: string,
          regenddate?: string,
          eventtime?: string,
          eventbannerimage?: string,
          adurl?: string,
          exhiburl?: string,
          sponurl?: string,
          participanturl?: string,
          status?: string
     }
}

type ReadmorProps = {
     data: string
}
// Types 

// Components
function ReadMore({ data }: ReadmorProps): JSX.Element {
     const [contentLength, setContentLength] = useState<number>(250)
     return (<article >{data.slice(0, contentLength)} <span className={contentLength <= 250 ? "underline decoration-blue-500 text-blue-500 cursor-pointer" : "hidden"} onClick={() => setContentLength(data.length)}>Read more...</span> <span className={contentLength > 250 ? "underline decoration-blue-500 text-blue-500 cursor-pointer" : "hidden"} onClick={() => setContentLength(250)}>Show Less</span></article>)
}
// Components

//Functions
//Functions

export default function Card({ event }: Cardprops) {
     let origin: string = window.location.href;
     if (origin.includes('3000')) {
          origin = origin + '/'
     }
     // console.log(origin)
     return (
          <div className="card w-80 lg:w-96 bg-base-100 shadow-xl ">
               <figure>
                    <img src={event.eventbannerimage} alt="eventimage" className='h-52 w-full object-cover' /></figure>
               <div className="card-body">
                    <div className="card-title text-center" dangerouslySetInnerHTML={{ __html: `${event.eventtitle}` }}>
                         {/* {event.eventtitle} */}
                         {/* <div className="badge badge-secondary">NEW</div> */}
                    </div>
                    {event.eventdescription!.length > 250 ? <ReadMore data={event.eventdescription!} /> : <p>{event.eventdescription}</p>}
                    <div className="card-actions justify-center mt-2">
                         {/* <div className="badge badge-success">{`${event.eventStartDate} - ${event.eventEndDate}`}</div>*/}

                         <div>{`${event.eventStartDate} - ${event.eventEndDate}`}</div>
                         {/* <div className="badge badge-warning"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                         </svg>
                              {event.eventVenue}</div>*/}
                         {/* <div className="badge badge-success">Registration Fee : &#8377;<strong>{event.mfees}</strong></div> */}
                    </div>

                    {/* <details title="Links" className="text-blue-500 font-bold leading-5 tracking-wide mt-2" id="carddetails" >
                         <summary>Registration For</summary>
                         <p className="pl-5 text-base text-gray-500 underline decoration-blue-400"><a href={event.participanturl} target="_blank" rel="noreferrer">Participants</a></p>
                         <p className="pl-5 text-base text-gray-500 underline decoration-blue-400"><a href={event.adurl} target="_blank" rel="noreferrer">Advertisor</a></p>
                         <p className="pl-5 text-base text-gray-500 underline decoration-blue-400"><a href={event.exhiburl} target="_blank" rel="noreferrer">Exhibitor</a></p>
                         <p className="pl-5 text-base text-gray-500 underline decoration-blue-400"><a href={event.sponurl} target="_blank" rel="noreferrer">Sponsor</a></p>
                    </details> */}
                    <hr className="mt-2" />

                    <div className="space-y-4">
                         {/* <h2 className="text-center">I Would Like To Register as</h2>*/}
                         <div className="flex gap-2 items-center justify-center flex-wrap">
                              {/* <span className="text-base badge badge-success"><a href={event.participanturl} className="p-2" target="_blank" rel="noreferrer">Conference Registration</a></span> */}
                              <span className="text-base badge badge-success"><a href={event.participanturl} className="p-2" target="_blank" rel="noreferrer">Click here for Registration</a></span>

                         </div>

                    </div>

               </div>
          </div>
     )
}
