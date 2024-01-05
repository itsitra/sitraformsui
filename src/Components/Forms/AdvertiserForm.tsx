import { useEffect, useState } from "react";
import FormCard from "../FormCard";
import Loader from "../Loader";
import PaymentCheck from "../PaymentCheck";
import TotalCostMobile from "../TotalCostMobile";

// Types
type AdvertiserFormTypes = {
     id: string,
     data: {
          eventData: {
               eventId: string | number,
               eventtitle: string,
               eventEndDate: string | Date
          },
          eventprices: {
               fullpage: string | number,
               halfpage: string | number,
               frontfullpage: string | number,
               backfullpage: string | number,
          }
     }[],
     personaldetails: {
          name: string,
          address: string,
          city: string,
          country: string,
          pin: number,
          mobileno: number,
          gst: string,
          telephone: string,
          email: string,
          alternateemail?: string,
          website: string
     },
     contactpersondetails: {
          cpname: string,
          cpnumber: number,
          cpemail: string,
          cpdesigination: string
     },
     otherdetails: {
          adCategoryPrice: number,
          file: string
     },
     gstStatus: boolean,
     updateGstStatus: Function,
     changePersonalData: Function,
     changeContactPersonDetails: Function,
     changeOtherDetails: Function,
     handleSubmit: Function,
     paymentDetails: {
          amount: number,
          bankname: string,
          dd_utr: string,
          date: string,
     },
     changePaymentDetails: Function,
     lists: { type: string, tax: number, selected: boolean }[],
     setLists: Function
}
type EventFormDatatype = {
     fullpage: string | number,
     halfpage: string | number,
     frontfullpage: string | number,
     backfullpage: string | number,
}
// Types

export default function AdvertiserForm({ id, data, personaldetails, contactpersondetails, otherdetails, changePersonalData, changeContactPersonDetails, changeOtherDetails, handleSubmit, paymentDetails, changePaymentDetails, gstStatus, updateGstStatus, lists, setLists }: AdvertiserFormTypes) {
     const [paymentModal, setPaymentModal] = useState<boolean>(false);
     const [eventTitle, setEventTitle] = useState<string>(data[0]!.eventData.eventtitle);
     const [eventFormData, setEventFormData] = useState<EventFormDatatype>(data[0]!.eventprices);
     const closeModal = () => {
          setPaymentModal(false)
          lists.forEach((e) => e.selected = false)
          changeOtherDetails({ ...otherdetails, adCategoryPrice: sessionStorage.getItem('eventcost') })
     }

     const saveAndOpenPaymentModal = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          handleSubmit('advertiser', e, setPaymentModal)
          // setPaymentModal(true)
     }

     const saveAmountinSession = (e: React.ChangeEvent<HTMLInputElement>) => {
          sessionStorage.setItem("eventcost", e.target.value.replace(/\,/g, ''))
          changeOtherDetails({ ...otherdetails, adCategoryPrice: Number(e.target.value.replace(/\,/g, '')) })
     }
     const saveEmailSession = (e: React.ChangeEvent<HTMLInputElement>) => {
          sessionStorage.setItem("custemail", e.target.value)
          changePersonalData({ ...personaldetails, email: e.target.value })
     }

     const urlEncode = (e: React.ChangeEvent<HTMLInputElement>) => {
          // let url = encodeURIComponent(e.target.value)
          let url = e.target.value;
          if (url.includes('edit')) {
               url = url.slice(0, url.indexOf('edit'))
          }
          changeOtherDetails({ ...otherdetails, file: url })
     }

     const changeAmount = (e: number, amount: number) => {
          let calAmount = amount + (amount * e / 100)
          changeOtherDetails({ ...otherdetails, adCategoryPrice: calAmount })
     }

     useEffect(() => {
          document.title = 'Advertiser Form';
          if (sessionStorage.getItem('eventcost')) {
               changeOtherDetails({ ...otherdetails, adCategoryPrice: Number(sessionStorage.getItem("eventcost")) })
          }
     }, [])
     return (
          <>
               {data.length > 0 ?
                    <div className="h-screen m-auto flex items-center justify-center md:w-1/2 lg:w-1/3">
                         <div id="form" className="w-full h-full m-5  py-5 space-y-2 relative">
                              <div id="formdetails" className="text-3xl font-bold tracking-wide bg-blue-100 w-full p-5 rounded-lg text-blue-600">
                                   <h1 dangerouslySetInnerHTML={{ __html: `${eventTitle}` }}></h1>
                              </div>
                              <form id="form" className="flex flex-col gap-4">
                                   <FormCard title="Advertiser Details">
                                        <div className="p-5 space-y-4 md:flex flex-wrap gap-5 items-center justify-center">
                                             <div className="form-control w-full">
                                                  <label className="label">
                                                       <span className="label-text">Name<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" value={personaldetails.name} onChange={(e) => changePersonalData({ ...personaldetails, name: e.target.value })} placeholder="Mill Name" className="input input-bordered w-full" />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Address<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <textarea placeholder="Mill Address" className="textarea textarea-bordered" value={personaldetails.address} onChange={(e) => changePersonalData({ ...personaldetails, address: e.target.value })} />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">City<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="City" value={personaldetails.city} onChange={(e) => changePersonalData({ ...personaldetails, city: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Country<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Country" value={personaldetails.country} onChange={(e) => changePersonalData({ ...personaldetails, country: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">PIN / ZIP Code<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="number" placeholder="Pin/Zip Code" value={personaldetails.pin} onChange={(e) => changePersonalData({ ...personaldetails, pin: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Mobile No<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="number" placeholder="Mobile No" value={personaldetails.mobileno} onChange={(e) => changePersonalData({ ...personaldetails, mobileno: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">GST No.<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <div className={gstStatus ? "flex gap-2 mb-5" : "flex gap-2"}>
                                                       <div className="form-control">
                                                            <label className="label cursor-pointer">
                                                                 <span className="label-text mr-1">Yes</span>
                                                                 <input type="radio" name="radio-6" className="radio" checked={gstStatus} onChange={() => updateGstStatus(true)} />
                                                            </label>
                                                       </div>
                                                       <div className="form-control">
                                                            <label className="label cursor-pointer">
                                                                 <span className="label-text mr-1">No</span>
                                                                 <input type="radio" name="radio-6" className="radio" checked={!gstStatus} onChange={() => updateGstStatus(false)} />
                                                            </label>
                                                       </div>
                                                  </div>

                                                  {
                                                       gstStatus &&
                                                       <input type="text" placeholder="GST Number" value={personaldetails.gst} onChange={(e) => changePersonalData({ ...personaldetails, gst: e.target.value })} className="input input-bordered w-full " />
                                                  }
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Telephone</span>
                                                  </label>
                                                  <input type="text" placeholder="Telephone Number" value={personaldetails.telephone} onChange={(e) => changePersonalData({ ...personaldetails, telephone: e.target.value })} className="input input-bordered w-full " />
                                             </div>

                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Email Id<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Email Id" value={personaldetails.email} onChange={(e) => saveEmailSession(e)} className="input input-bordered w-full " />
                                                  <div className="form-control w-full">
                                                       <label className="label">
                                                            <span className="label-text">Alternate Email Id</span>
                                                       </label>
                                                       <input type="text" placeholder="Optional Email" value={personaldetails.alternateemail} onChange={(e) => changePersonalData({ ...personaldetails, alternateemail: e.target.value })} className="input input-bordered w-full " />
                                                  </div>
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Website</span>
                                                  </label>
                                                  <input type="text" placeholder="Website URL" value={personaldetails.website} onChange={(e) => changePersonalData({ ...personaldetails, website: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                        </div>
                                   </FormCard>
                                   <FormCard title="Contact Person Details">
                                        <div className="p-5 space-y-4">
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Name<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Contact Person Name" value={contactpersondetails.cpname} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpname: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Designation<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Contact Person Designation" value={contactpersondetails.cpdesigination} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpdesigination: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Number<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="number" placeholder="Contact Person Number" value={contactpersondetails.cpnumber} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpnumber: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Email<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Contact Person Email" value={contactpersondetails.cpemail} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpemail: e.target.value })} className="input input-bordered w-full " />
                                             </div>

                                        </div>
                                   </FormCard>
                                   <FormCard title="Advertisement Category">
                                        <div className="p-5 space-y-4">
                                             <div className="form-control w-full ">
                                                  <label className="label mb-2">
                                                       <span className="label-text font-bold">Advertisement Category<strong className="text-red-500">*</strong></span>
                                                       <span className="label-text-alt">[Note: Including GST] </span>
                                                  </label>
                                                  <hr />
                                                  <div className="flex gap-5 flex-col my-3">
                                                       <label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Front inside Full Page</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.frontfullpage).toLocaleString()}/</span>
                                                            </div>
                                                            <input type="radio" name="radio-6" value={eventFormData!.frontfullpage} onChange={(e) => saveAmountinSession(e)} className="radio checked:bg-blue-500" />
                                                       </label>
                                                       <label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Back inside Full Page</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.backfullpage).toLocaleString()}/</span>
                                                            </div>
                                                            <input type="radio" name="radio-6" value={eventFormData!.backfullpage} onChange={(e) => saveAmountinSession(e)} className="radio checked:bg-blue-500" />
                                                       </label>
                                                       <label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Full Page</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.fullpage).toLocaleString()}/</span>
                                                            </div>

                                                            <input type="radio" name="radio-6" className="radio checked:bg-blue-500" value={eventFormData!.fullpage} onChange={(e) => saveAmountinSession(e)} />
                                                       </label>
                                                       <label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Half Page</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.halfpage).toLocaleString()}/</span>
                                                            </div>
                                                            <input type="radio" name="radio-6" value={eventFormData!.halfpage} onChange={(e) => saveAmountinSession(e)} className="radio checked:bg-blue-500" />
                                                       </label>

                                                  </div>
                                                  <hr />
                                             </div>
                                             {/* <div className="mt-2">
                                             <span className="label-text"><strong className="text-red-500">*</strong> Upload your file in GoogleDrive and give access to the file to <span className="link">sitraconference@gmail.com</span>.</span>
                                        </div> */}
                                             {/* <div className="flex gap-5 items-start justify-between"> */}
                                             <div className="form-control w-full">
                                                  <label className="label" htmlFor="fileupload">
                                                       <span className="label-text font-bold">Design File Upload LINK</span>
                                                  </label>
                                                  <div className="mb-2">
                                                       <span className="label-text"><strong className="text-red-500">*</strong> Upload your file in GoogleDrive and give access to the file to <span className="link">sitraconference@gmail.com</span>.</span>
                                                  </div>
                                                  <input type="text" id="fileupload" placeholder="Enter your googledrive link of the file" className="input input-bordered" value={otherdetails.file} onChange={(e) => urlEncode(e)} />
                                                  <label className="label mb-2" htmlFor="fileupload">
                                                       <span className="label-text-alt"><strong className="text-red-500">*</strong> Design in COREL DRAW/JPEG/TIFF(300 DPI)</span>
                                                  </label>
                                             </div>
                                             {/* : <p className="text-sm font-semibold text-center flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                                        </svg>
                                             <label htmlFor="fileupload"> File Waiting to upload </label><strong className="text-xs pl-5">Do not refresh this page</strong>
                                             <input type="file" id="fileupload" className="hidden" onChange={(e) => handleFileUpload(e)} /></p>} */}
                                        </div>
                                   </FormCard>
                                   {(sessionStorage.getItem('userID') === null || sessionStorage.getItem('userID') === undefined || sessionStorage.getItem('userID') === '') ? <div className="form-control mb-10 mt-2">
                                        <button className="btn btn-info text-lg text-blue-50" onClick={(e) => saveAndOpenPaymentModal(e)}>Save
                                        </button>
                                   </div> : <div className="form-control mb-10 mt-2">
                                        <button className="btn btn-info text-lg text-blue-50" disabled>Saved <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-3">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                        </svg></button>
                                   </div>}
                              </form>
                         </div>
                         <div className="lg:hidden">
                              <TotalCostMobile cost={otherdetails.adCategoryPrice} openmodal={setPaymentModal} />
                         </div>
                         {paymentModal && <PaymentCheck closeModal={closeModal} paymentDetails={paymentDetails} changePaymentDetails={changePaymentDetails} formtype={id} amount={otherdetails.adCategoryPrice} custname={personaldetails.name} custemail={personaldetails.email} custmobile={personaldetails.mobileno} changeAmount={changeAmount} lists={lists} setLists={setLists} generalDetails={personaldetails}/>}
                    </div> : <Loader />
               }

               {(sessionStorage.getItem("userID") !== null && sessionStorage.getItem('paymentstatus') !== 'Success') && <div data-tip="Click here to do payment" className="tooltip tooltip-left hidden md:visible h-20 w-20 rounded-full bg-blue-200 fixed top-5 right-5 md:flex items-center justify-center cursor-pointer shadow-xl" onClick={() => setPaymentModal(true)}><p><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
               </svg>
               </p></div>}

               {(sessionStorage.getItem('paymentstatus') === 'Success') && <div onClick={(e) => {
                    e.currentTarget.classList.add("md:hidden")
               }} className="hidden md:visible h-20 w-max rounded-lg animate-bounce bg-blue-200 fixed bottom-80 right-5 md:flex items-center justify-center cursor-pointer shadow-xl"><p className="p-2 text-xl font-bold text-blue-700 flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
               </svg>
                         Payment Success
                    </p></div>}
          </>
     )
}

