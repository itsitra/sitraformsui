import React, { useEffect, useState } from "react";
import FormCard from "../FormCard";
import Loader from "../Loader";
import PaymentCheck from "../PaymentCheck";
import TotalCostMobile from "../TotalCostMobile";

// Types
type ExhibitorFormTypes = {
     id: string,
     data: {
          eventData: {
               eventId: string | number,
               eventtitle: string,
               eventEndDate: string | Date,
               eventbrochure?: string
          },
          eventprices: {
               supreme: string | number,
               ultra: string | number,
               star: string | number,
               standard: string | number,
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
          stallPrice: number,
          stallFacia: string,
          stallName: string,
          powerStatus: boolean,
          powerDesc: string,
          waterStatus: boolean,
          cAirStatus: boolean,
          cAirDesc: string
          productsDealingWith: string
     },
     eventproductsList: object[],
     gstStatus: boolean,
     updateGstStatus: Function,
     updateEventProductList: Function,
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
     supreme: string | number,
     ultra: string | number,
     star: string | number,
     standard: string | number,
}

type productListType = {
     pl: {
          productname: string,
          productid: number,
          productSelected?: boolean
     }


}
// Types

export default function ExhibitorForm({ id, data, personaldetails, contactpersondetails, otherdetails, changePersonalData, changeContactPersonDetails, changeOtherDetails, handleSubmit, paymentDetails, changePaymentDetails, eventproductsList, updateEventProductList, gstStatus, updateGstStatus, lists, setLists }: ExhibitorFormTypes) {
     const [paymentModal, setPaymentModal] = useState<boolean>(false);
     const [eventTitle, setEventTitle] = useState<string>(data[0]!.eventData.eventtitle);
     const [eventFormData, setEventFormData] = useState<EventFormDatatype>(data[0]!.eventprices);
     const [otherName, setOtherName] = useState<string>("")

     const closeModal = () => {
          setPaymentModal(false)
          lists.forEach((e) => e.selected = false)
          changeOtherDetails({ ...otherdetails, stallPrice: sessionStorage.getItem('eventcost') })
     }
     const saveAndOpenPaymentModal = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          handleSubmit('exhibitor', e, setPaymentModal)
          // setPaymentModal(true)
     }

     const setstallValues = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
          sessionStorage.setItem("eventcost", e.target.value.replace(/\,/g, ''))
          changeOtherDetails({ ...otherdetails, stallPrice: Number(e.target.value.replace(/\,/g, '')), stallName: type === 'supreme' ? 'supreme' : type === 'ultra' ? 'ultra' : type === 'star' ? 'star' : 'standard' })
     }

     const saveEmailSession = (e: React.ChangeEvent<HTMLInputElement>) => {
          sessionStorage.setItem("custemail", e.target.value)
          changePersonalData({ ...personaldetails, email: e.target.value })
     }

     const addTextCommaAsLongText = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
          if (e.target.checked) {
               if (otherdetails.productsDealingWith === '') {
                    changeOtherDetails({ ...otherdetails, productsDealingWith: e.target.value })
               } else {
                    changeOtherDetails({ ...otherdetails, productsDealingWith: otherdetails.productsDealingWith + ',' + e.target.value })
               }
          } else {
               changeOtherDetails({ ...otherdetails, productsDealingWith: otherdetails.productsDealingWith.replaceAll(e.target.value, '') })
          }
          let newArr: any = [...eventproductsList]
          newArr[i].productSelected = e.target.checked
          updateEventProductList(newArr)
     }
     const addTextCommaAsLongTextOthers = (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault()
          changeOtherDetails({ ...otherdetails, productsDealingWith: otherdetails.productsDealingWith + ',' + otherName })
          setOtherName("")
     }

     const removeProduct = (e: React.MouseEvent<HTMLElement>, name: string) => {
          e.preventDefault()
          let newArr: any = [...eventproductsList]
          newArr.find((o: any, i: number) => {
               if (o.productname === name) {
                    newArr[i].productSelected = false
                    updateEventProductList(newArr)
               }
          });
          changeOtherDetails({ ...otherdetails, productsDealingWith: otherdetails.productsDealingWith.replaceAll(name, '') })
     }

     const changeAmount = (e: number, amount: number) => {
          let calAmount = amount + (amount * e / 100)
          changeOtherDetails({ ...otherdetails, stallPrice: calAmount })
     }

     useEffect(() => {
          document.title = 'Exhibitor Form';
          if (sessionStorage.getItem('eventcost')) {
               changeOtherDetails({ ...otherdetails, stallPrice: Number(sessionStorage.getItem("eventcost")) })
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
                                   <FormCard title="Exhibitor Details">
                                        <div className="p-5 space-y-4 md:flex flex-wrap gap-5 items-center justify-center">
                                             <div className="form-control w-full">
                                                  <label className="label">
                                                       <span className="label-text">Name <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" value={personaldetails.name} onChange={(e) => changePersonalData({ ...personaldetails, name: e.target.value })} placeholder="Mill Name" className="input input-bordered w-full" />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Address <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <textarea placeholder="Mill Address" className="textarea textarea-bordered" value={personaldetails.address} onChange={(e) => changePersonalData({ ...personaldetails, address: e.target.value })} />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">City <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="City" value={personaldetails.city} onChange={(e) => changePersonalData({ ...personaldetails, city: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Country <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Country" value={personaldetails.country} onChange={(e) => changePersonalData({ ...personaldetails, country: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">PIN / ZIP Code <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="number" placeholder="Pin/Zip Code" value={personaldetails.pin} onChange={(e) => changePersonalData({ ...personaldetails, pin: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Mobile No <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="number" placeholder="Mobile No" value={personaldetails.mobileno} onChange={(e) => changePersonalData({ ...personaldetails, mobileno: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">GST No.</span>
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
                                                       <span className="label-text">Email Id <strong className="text-red-500">*</strong></span>
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
                                                       <span className="label-text">Contact Person Name <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Contact Person Name" value={contactpersondetails.cpname} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpname: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Designation <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Contact Person Designation" value={contactpersondetails.cpdesigination} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpdesigination: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Number <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="number" placeholder="Contact Person Number" value={contactpersondetails.cpnumber} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpnumber: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label">
                                                       <span className="label-text">Contact Person Email <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <input type="text" placeholder="Contact Person Email" value={contactpersondetails.cpemail} onChange={(e) => changeContactPersonDetails({ ...contactpersondetails, cpemail: e.target.value })} className="input input-bordered w-full " />
                                             </div>
                                        </div>
                                   </FormCard>
                                   <FormCard title="Stall(s) Required">
                                        <div className="p-5 space-y-4">
                                             <div className="form-control w-full ">
                                                  <label className="label mb-2">
                                                       <span className="label-text font-bold">Stall(s) Required <strong className="text-red-500">*</strong></span>
                                                       {/* <span className="label-text-alt">[Note: Charges GST @18% additional extra] </span> */}
                                                       <span className="label-text-alt">[Note: Including GST] </span>
                                                       <a href={data[0].eventData.eventbrochure} className="link link-secondary" download target="_blank">Stall Pricing Info</a>
                                                  </label>
                                                  <hr />
                                                  <div className="flex gap-5 flex-col my-3">
                                                       <label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Supreme</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.supreme).toLocaleString()}/</span>
                                                            </div>

                                                            <input type="radio" name="radio-6" className="radio checked:bg-blue-500" value={Number(eventFormData!.supreme).toLocaleString()} onChange={(e) => { setstallValues(e, 'supreme') }} />
                                                       </label>
                                                       <label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Ultra</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.ultra).toLocaleString()}/</span>
                                                            </div>
                                                            <input type="radio" name="radio-6" className="radio checked:bg-blue-500" value={Number(eventFormData!.ultra).toLocaleString()} onChange={(e) => { setstallValues(e, 'ultra') }} />
                                                       </label><label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Star</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.star).toLocaleString()}/</span>
                                                            </div>
                                                            <input type="radio" name="radio-6" className="radio checked:bg-blue-500" value={Number(eventFormData!.star).toLocaleString()} onChange={(e) => { setstallValues(e, 'star') }} />
                                                       </label><label className="label cursor-pointer space-x-3">
                                                            <div className="flex flex-col gap-2">
                                                                 <span className="label-text">Standard</span>
                                                                 <span className="label-text">&#8377;{Number(eventFormData!.standard).toLocaleString()}/</span>
                                                            </div>
                                                            <input type="radio" name="radio-6" className="radio checked:bg-blue-500" value={Number(eventFormData!.standard).toLocaleString()} onChange={(e) => { setstallValues(e, 'standard') }} />
                                                       </label>
                                                  </div>
                                                  <hr />
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label mb-2">
                                                       <span className="label-text font-bold">Stall Facia Name <strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <hr />
                                                  <div className="form-control w-full mt-2">
                                                       <textarea placeholder="IN CAPS" className="textarea textarea-bordered w-full " value={otherdetails.stallFacia} onChange={(e) => changeOtherDetails({ ...otherdetails, stallFacia: e.target.value })} />
                                                       <label className="label">
                                                            <span className="label-text-alt">Not More than 40 Characters</span>
                                                       </label>
                                                  </div>
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label mb-2">
                                                       <span className="label-text font-bold">Additional Requirements on cost basis</span>
                                                       <span className="label-text-alt">[Cost will be informed After exhibition] </span>
                                                  </label>
                                                  <hr />
                                                  <div className="form-control w-full mt-2">
                                                       <label className="label cursor-pointer space-x-3">
                                                            <span className="label-text">Power</span>
                                                            {/* <input type="checkbox" className="checkbox checkbox-accent" onChange={(e) => changeOtherDetails({ ...otherdetails, powerStatus: e.target.checked })} /> */}
                                                       </label>
                                                       <input type="text" placeholder="Define KVA required" className="input input-bordered" value={otherdetails.powerDesc} onChange={(e) => changeOtherDetails({ ...otherdetails, powerDesc: e.target.value })} />
                                                       <label className="label">
                                                            <span className="label-text-alt">Define KVA required</span>
                                                       </label>
                                                  </div>
                                                  <div className="form-control w-full mt-2">
                                                       <label className="label cursor-pointer space-x-3">
                                                            <span className="label-text">Water</span>
                                                            <input type="checkbox" className="checkbox checkbox-accent" onChange={(e) => changeOtherDetails({ ...otherdetails, waterStatus: e.target.checked })} />
                                                       </label>
                                                  </div>
                                                  <div className="form-control w-full mt-2">
                                                       <label className="label cursor-pointer space-x-3">
                                                            <span className="label-text">Compressed Air</span>
                                                            {/* <input type="checkbox" className="checkbox checkbox-accent" onChange={(e) => changeOtherDetails({ ...otherdetails, cAirStatus: e.target.checked })} /> */}
                                                       </label>
                                                       <input type="text" placeholder="Specify flow in litter / minute, pressure in PSI / bar" className="input input-bordered" value={otherdetails.cAirDesc} onChange={(e) => changeOtherDetails({ ...otherdetails, cAirDesc: e.target.value })} />
                                                       <label className="label">
                                                            <span className="label-text-alt">Specify flow in litter / minute, pressure in PSI / bar</span>
                                                       </label>
                                                  </div>
                                             </div>
                                             <div className="form-control w-full ">
                                                  <label className="label mb-2">
                                                       <span className="label-text font-bold">Product(s) Dealing With<strong className="text-red-500">*</strong></span>
                                                  </label>
                                                  <hr />
                                                  <div className="form-control w-full mt-2">
                                                       {eventproductsList && eventproductsList.map((pl: any, i: number) => <div className="form-control w-full mt-2" key={pl.productid}>
                                                            <label className="label cursor-pointer space-x-3">
                                                                 <span className="label-text">{pl.productname}</span>
                                                                 <input type="checkbox" className="checkbox checkbox-accent" value={pl.productname} onChange={(e) => addTextCommaAsLongText(e, i)} checked={pl.productSelected} />
                                                            </label>
                                                       </div>)}
                                                       <div className="form-control mt-2">
                                                            <label className="label"><span className="label-text">Others Please Specify</span></label>
                                                            <div className="flex flex-row gap-5 ">
                                                                 <input placeholder="If Others Please Specify, and click the add button." className="textarea textarea-bordered w-full" value={otherName} onChange={(e) => setOtherName(e.target.value)} />
                                                                 <button className="btn btn-outline btn-info " onClick={(e) => addTextCommaAsLongTextOthers(e)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                 </svg>
                                                                 </button>
                                                            </div>

                                                       </div>
                                                  </div>
                                                  <div className="flex gap-2 flex-wrap mt-2">
                                                       {otherdetails.productsDealingWith != '' && otherdetails.productsDealingWith.split(',').map((pl: any, i: number) => pl !== '' && <p key={i} className="h-max bg-blue-200 rounded-lg flex items-center justify-center p-1 ">{pl} <span className="ml-2" onClick={(e) => removeProduct(e, pl)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                       </span>
                                                       </p>)}
                                                  </div>
                                             </div>
                                        </div>
                                   </FormCard>
                                   {(sessionStorage.getItem('userID') === null || sessionStorage.getItem('userID') === undefined || sessionStorage.getItem('userID') === '') ? <div className="form-control mb-10 mt-2">
                                        <button className="btn btn-info text-lg text-blue-50" onClick={(e) => saveAndOpenPaymentModal(e)}>Save
                                        </button>
                                   </div> : <div className="form-control mb-10 mt-2">
                                        <button className="btn btn-info text-lg text-blue-50" disabled>Saved <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-3">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                        </svg>
                                        </button>
                                   </div>}
                              </form>
                         </div>
                         <div className="lg:hidden">
                              <TotalCostMobile cost={otherdetails.stallPrice} openmodal={setPaymentModal} />
                         </div>
                         {paymentModal && <PaymentCheck closeModal={closeModal} paymentDetails={paymentDetails} changePaymentDetails={changePaymentDetails} formtype={id} amount={otherdetails.stallPrice} custname={personaldetails.name} custemail={personaldetails.email} custmobile={personaldetails.mobileno} changeAmount={changeAmount} lists={lists} setLists={setLists} generalDetails={personaldetails} />}
                    </div>
                    : <Loader />}

               {(sessionStorage.getItem("userID") !== null && sessionStorage.getItem('paymentstatus') !== 'Success') && <div data-tip="Click here to do payment" className="tooltip tooltip-left hidden md:visible h-20 w-20 rounded-full bg-blue-200 fixed top-5 right-5 md:flex items-center justify-center cursor-pointer shadow-xl" onClick={() => setPaymentModal(true)}><p><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10" >
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

