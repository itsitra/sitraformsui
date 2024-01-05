// Imports
import { useEffect, useState } from "react";
import Cards from "../Components/Cards";
import Loader from "../Components/Loader";
import SearchBox from "../Components/SearchBox";
import useHttp from "../hooks/useHttp";
// Imports


// Types 
type WelcomeData = {
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
};
// Types


export default function Welcome() {
     const [data, setData] = useState<WelcomeData[]>([])
     const { Get: getevents } = useHttp()
     useEffect(() => {
          const controller = new AbortController();
          let signal = controller.signal;
          setData([])
          getevents('/', signal).then((res: any) => {

               setData((old) => [...old, ...res.data])
          })

          return () => {
               controller.abort();
          };
     }, [])
     return (
          <div className={`h-full w-full flex flex-col gap-5`}>
               {
                    data.length !== 0 ?
                         <>
                              <SearchBox />
                              <Cards data={data} />
                         </> : <Loader />}
          </div>
     )
}
