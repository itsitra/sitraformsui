// Imports
import Card from "./Card";
// Imports

// Types 
type CardsProps = {
     data: {
          eventId: string,
          eventtitle: string,
          eventdescription: string,
          eventVenue: string,
          mfees: string,
          nmfees: string,
          eventduration: string,
          eventStartDate: string,
          eventEndDate: string,
          regstartdate: string,
          regenddate: string,
          eventtime: string,
          eventbannerimage: string,
          adurl: string,
          exhiburl: string,
          sponurl: string,
          participanturl: string,
          status: string
     }[]
}
// Types 


export default function Cards({ data }: CardsProps) {

     return (
          <div className="flex flex-col gap-10 my-5 md:flex-wrap md:flex-row items-center justify-center "
          >{
                    data.length > 0 ? data.map((d: object, i: number) => <Card key={i} event={d} />) : <p>Loading...</p>
               }</div>
     )
}
