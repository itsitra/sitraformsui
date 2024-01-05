export default function SearchBox() {
     return (
          <div className="mt-10 w-full flex items-center justify-center">
               <div className="w-96 mx-5">
                    <div className="relative flex items-center">
                         <div className="absolute md:-bottom-9 -bottom-8 left-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              </svg>

                         </div>

                    </div>
                    <input placeholder="Search.." className="input input-bordered w-full pl-10" />
               </div>

          </div>
     )
}
