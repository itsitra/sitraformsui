import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import AlertCard from "../Components/AlertCard";
import AdvertiserForm from "../Components/Forms/AdvertiserForm"
import ExhibitorForm from "../Components/Forms/ExhibitorForm"
import ParticipantsForm from "../Components/Forms/ParticipantsForm"
import SponsorForm from "../Components/Forms/SponsorForm"
import Loader from "../Components/Loader";
import useHttp from "../hooks/useHttp";



// Types 
type FormEventDatatype = {
     eventData: {
          eventId: string | number,
          eventtitle: string,
          eventEndDate: string | Date,
          eventbrochure?: string
     },
     eventprices: {
          fullpage: string | number,
          halfpage: string | number,
          frontfullpage: string | number,
          backfullpage: string | number,
          supreme: string | number,
          ultra: string | number,
          star: string | number,
          standard: string | number,
          platinum: string | number,
          diamond: string | number,
          gold: string | number,
          silver: string | number,
     },


};

type GeneralDataType = {
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
}

type ContactPersonType = {
     cpname: string,
     cpnumber: number,
     cpemail: string,
     cpdesigination: string
}

type AdvertiserOptionType = {
     adCategoryPrice: number,
     file: string
}

type ExhibitorOptionType = {
     stallPrice: number,
     stallFacia: string,
     stallName: string,
     powerStatus: boolean,
     powerDesc: string,
     waterStatus: boolean,
     cAirStatus: boolean,
     cAirDesc: string
     productsDealingWith: string
}

type PaymentOptionType = {
     amount: number,
     bankname: string,
     dd_utr: string,
     date: string,
}

type SponsorOptionType = {
     sponsortype: string,
     sponsorpackage: number,
     file: string
}

type ExhibitorEventProducts = {
     productname: string,
     productid: number | string,
     productSelected: boolean
}

type PaymentTeaxesType = {
     type: string,
     tax: number,
     selected: boolean
}[]
// Types

export default function Form() {
     const [formType, setFormType] = useState<string>('')
     const [datasavedButPayment, setDatasavedButPayment] = useState<boolean>(false);
     const [eventData, setEventData] = useState<FormEventDatatype[]>([])
     const [eventExibitorProducts, setEventExibitorProducts] = useState<ExhibitorEventProducts[]>([])
     const [alertStatus, setAlertStatus] = useState<boolean>(false)
     const [alertMsg, setAlertMsg] = useState<string>('')
     const [gstStatus, setGstStatus] = useState<boolean>(false)
     const [generalData, setGeneralData] = useState<GeneralDataType>({
          name: '',
          address: '',
          city: '',
          country: '',
          pin: Number(),
          mobileno: Number(),
          gst: '',
          telephone: '',
          email: '',
          alternateemail: '',
          website: ''
     })
     const [contactPersonData, setContactPersonData] = useState<ContactPersonType>({
          cpname: "",
          cpnumber: Number(0),
          cpemail: "",
          cpdesigination: ""
     })

     const [adCategoryOption, setAdCategoryOption] = useState<AdvertiserOptionType>({
          adCategoryPrice: Number(0),
          file: ''
     })

     const [exhibitorCategoryOption, setExhibitorCategoryOptionCategoryOption] = useState<ExhibitorOptionType>({
          stallPrice: 0,
          stallFacia: '',
          stallName: '',
          powerStatus: false,
          powerDesc: '',
          waterStatus: false,
          cAirStatus: false,
          cAirDesc: '',
          productsDealingWith: ''

     })

     const [sponsorCategoryOption, setSponsorCategoryOptionCategoryOption] = useState<SponsorOptionType>({
          sponsortype: "",
          sponsorpackage: 0,
          file: ""

     })

     const [paymentDetails, setPaymentDetails] = useState<PaymentOptionType>({
          amount: Number(),
          bankname: '',
          dd_utr: '',
          date: '',
     })
     const [taxes, setTaxes] = useState<PaymentTeaxesType>([])

     const { id } = useParams()
     const { Get: fetchEventData, Post: addUsertoEvent } = useHttp()
     let navigate = useNavigate()

     useEffect(() => {
          if (id?.startsWith('A', 0)) {
               setFormType('A')
          }
          if (id?.startsWith('E', 0)) {
               setFormType('E')
          }
          if (id?.startsWith('S', 0)) {
               setFormType('S')
          }
          if (id?.startsWith('P', 0)) {
               setFormType('P')
          }

          const controller = new AbortController();
          let signal = controller.signal;

          setEventData([])
          setEventExibitorProducts([])
          fetchEventData(`/getCheckForm?id=${id}`, signal).then(({ data, error }) => {
               if (Object.keys(data).length > 0 || data.length > 0) {
                    let tempobj = data;
                    if (Object.keys(data.eventprices).length === 2) {
                         setEventExibitorProducts((old) => [...old, ...data.eventprices.eventproducts])
                         tempobj = { ...tempobj, eventprices: tempobj.eventprices.eventprices }
                    }
                    if (Object.keys(data.eventprices).length === 2) {
                         setEventData((old) => [...old, tempobj])
                    } else {
                         setEventData((old) => [...old, data])
                    }
                    setTaxes(data.taxes)
                    let eventidtype: string;
                    if (id?.startsWith('A')) {
                         eventidtype = 'A'
                    }
                    if (id?.startsWith('E')) {
                         eventidtype = 'E'
                    }
                    if (id?.startsWith('S')) {
                         eventidtype = 'S'
                    }
                    if (id?.startsWith('P')) {
                         eventidtype = 'P'
                    }
                    sessionStorage.setItem('formtype', eventidtype!)
                    sessionStorage.setItem('eventid', data?.eventData.eventId)
                    sessionStorage.setItem('eventlink', id!)
                    localStorage.setItem('formtype', eventidtype!)
                    localStorage.setItem('eventid', data?.eventData.eventId)
               } else {
                    navigate(`/${id}`)
               }
          })
          return () => {
               controller.abort();
          };
     }, [id])

     function closeAlertModal() {
          setAlertStatus(false)
     }
     function validateField(type: string): boolean[] {
          // General Data Validation
          let generalValidation: boolean = false;

          // Conatct Person data validation
          let cpValidation: boolean = false;

          // Other Data Validation
          let odValidation: boolean = false;

          // General validation condition
          if (generalData.name !== '' && generalData.address !== '' && generalData.city !== '' && generalData.country !== '' && (generalData.pin !== 0) && generalData.mobileno !== 0 && generalData.email !== '') {
               // console.log(true, generalData.name)
               generalValidation = true;
               if (gstStatus === true && generalData.gst !== '') {
                    generalValidation = true;
               } else {
                    generalValidation = false;
               }
               if (gstStatus === false) {
                    generalValidation = true;
               }

          } else {
               generalValidation = false;
          }

          // Conatct Person data validation condition
          if ((contactPersonData.cpname !== '') && (contactPersonData.cpnumber !== 0) && (contactPersonData.cpemail !== '') && (contactPersonData.cpdesigination !== '')) {
               cpValidation = true
          }

          // Other Details data validation condition
          if (type === 'advertiser') {
               if (adCategoryOption.adCategoryPrice !== 0 && adCategoryOption.file !== '') {
                    odValidation = true
               }
          } else if (type === 'sponsor') {
               if (sponsorCategoryOption.sponsorpackage !== 0 && sponsorCategoryOption.file !== '') {
                    odValidation = true
               }
          } else if (type === 'exhibitor') {
               if (exhibitorCategoryOption.stallPrice !== 0 && exhibitorCategoryOption.stallFacia !== '' && exhibitorCategoryOption.productsDealingWith !== '') {
                    odValidation = true
               }
          }

          return [
               generalValidation, cpValidation, odValidation
          ]

     }

     function removeUserAlert(): void {
          setTimeout(() => {
               setAlertMsg("")
          }, 5000)
     }
     async function handleSubmit(formtype: string, e: React.MouseEvent<HTMLButtonElement>, openModal: Function): Promise<boolean | void> {
          e.preventDefault()
          // const isGeneralNotEmpty: boolean = Object.values(generalData).every(x => x !== null && x !== '' && x !== 0);
          // const isContactPersonNotEmpty: boolean = Object.values(contactPersonData).every(x => x !== null && x !== '' && x !== 0);
          // const isCategoryAdNotEmpty: boolean = Object.values(adCategoryOption).every(x => x !== null && x !== '' && x !== 0);
          // const isCategoryExhibitorNotEmpty: boolean = Object.values(exhibitorCategoryOption).every(x => x !== null && x !== '' && x !== 0);
          // const isSponsorPackageNotEmpty: boolean = Object.values(sponsorCategoryOption).every(x => x !== null && x !== '' && x !== 0);

          let data: object;
          if (formtype === 'advertiser') {
               const adVal: boolean[] = validateField('advertiser');
               let [generalValidation, cpValidation, odValidation] = adVal
               // console.log(generalValidation, cpValidation, odValidation)
               if (generalValidation && cpValidation && odValidation) {
                    data = { ...generalData, ...contactPersonData, ...adCategoryOption, type: 'A', eventid: sessionStorage.getItem('eventid') }
                    let jdata: object | string = JSON.stringify(data!)

                    addUsertoEvent('/addeventuser', jdata).then(({ data, error, loading, message }) => {
                         if (message === 'User already exists in the event' || message.includes('Error')) {
                              setAlertStatus(true)
                              setAlertMsg("User Already exists")
                              return false;
                         } else if (message === 'User already exists but needs to finish payment' || message.includes('payment')) {
                              sessionStorage.setItem('userID', data.userdata)
                              sessionStorage.setItem('eventcost', data.amount)
                              openModal(true)
                              return true;
                         } else {
                              // setAlertStatus(true)
                              setAlertMsg(`You data is saved, and your id is ${data.userdata}, use this as reference for any enquiry`)
                              removeUserAlert()
                              sessionStorage.setItem('userID', data.userdata)

                              openModal(true)

                              return true;
                         }
                    }).catch((err) => {
                         alert(err);
                    })
                    // console.log(jdata)
               } else {
                    setAlertStatus(true)
                    setAlertMsg("Enter All Fields")
               }
          }
          if (formtype === 'exhibitor') {
               const exhiVal: boolean[] = validateField('exhibitor');
               let [generalValidation, cpValidation, odValidation] = exhiVal
               // console.log(generalValidation, cpValidation, odValidation)
               if (generalValidation && cpValidation && odValidation) {
                    data = { ...generalData, ...contactPersonData, ...exhibitorCategoryOption, type: 'E', eventid: sessionStorage.getItem('eventid') }
                    let jdata: object | string = JSON.stringify(data!)

                    addUsertoEvent('/addeventuser', jdata).then(({ data, error, loading, message }) => {
                         if (message === 'User already exists in the event' || message.includes('Error')) {
                              setAlertStatus(true)
                              setAlertMsg("User Already exists")
                              return false;
                         } else if (message === 'User already exists but needs to finish payment' || message.includes('payment')) {
                              sessionStorage.setItem('userID', data.userdata)
                              sessionStorage.setItem('eventcost', data.amount)
                              openModal(true)
                              return true;
                         } else {
                              // setAlertStatus(true)
                              setAlertMsg(`You data is saved, and your id is ${data.userdata}, use this as reference for any enquiry`)
                              sessionStorage.setItem('userID', data.userdata)
                              removeUserAlert()
                              openModal(true)
                              return true;
                         }
                    }).catch((err) => {
                         alert(err);
                    })
                    // console.log(jdata)
               }
               else {
                    setAlertStatus(true)
                    setAlertMsg("Enter All Fields")
               }
          }
          if (formtype === 'sponsor') {
               const spVal: boolean[] = validateField('sponsor');
               let [generalValidation, cpValidation, odValidation] = spVal
               // console.log(generalValidation, cpValidation, odValidation)
               if (generalValidation && cpValidation && odValidation) {
                    data = { ...generalData, ...contactPersonData, ...sponsorCategoryOption, type: 'S', eventid: sessionStorage.getItem('eventid') }
                    let jdata: object | string = JSON.stringify(data!)

                    addUsertoEvent('/addeventuser', jdata).then(({ data, error, loading, message }) => {
                         if (message === 'User already exists in the event' || message.includes('Error')) {
                              setAlertStatus(true)
                              setAlertMsg("User Already exists")
                              return false;
                         } else if (message === 'User already exists but needs to finish payment' || message.includes('payment')) {
                              sessionStorage.setItem('userID', data.userdata)
                              sessionStorage.setItem('eventcost', data.amount)
                              openModal(true)
                              return true;
                         } else {
                              // setAlertStatus(true)
                              setAlertMsg(`You data is saved, and your id is ${data.userdata}, use this as reference for any enquiry`)
                              sessionStorage.setItem('userID', data.userdata)
                              removeUserAlert()
                              openModal(true)
                              return true;
                         }
                    }).catch((err) => {
                         alert(err);
                    })
                    // console.log(jdata)
               }
               else {
                    setAlertStatus(true)
                    setAlertMsg("Enter All Mandatory Fields")
               }
          }
          // let jdata: object | string = JSON.stringify({ "name": "nirosh", "address": "ssdsd", "city": "covai", "country": "india", "pin": "641035", "mobileno": "8220222098", "gst": "12344545", "telephone": "2323", "fax": "2323", "email": "emaill", "website": "nk.dev", "cpname": "hk", "cpnumber": "8220222098", "cpemail": "email", "cpdesigination": "hk", "stallPrice": "2,50,000", "stallFacia": "dddsdsd", "stallName": "supreme", "powerStatus": true, "powerDesc": "434434", "waterStatus": true, "cAirStatus": true, "cAirDesc": "dsfdsf", "productsDealingWith": "dsfdsfdf", "type": "E", "eventid": "1" })
     }



     return (
          <>
               {eventData.length > 0 ?
                    <section>
                         {formType === 'A' && <AdvertiserForm id={id!} data={eventData} personaldetails={generalData} contactpersondetails={contactPersonData} otherdetails={adCategoryOption} changePersonalData={setGeneralData} changeContactPersonDetails={setContactPersonData} changeOtherDetails={setAdCategoryOption} handleSubmit={handleSubmit} paymentDetails={paymentDetails} changePaymentDetails={setPaymentDetails} gstStatus={gstStatus} updateGstStatus={setGstStatus} lists={taxes} setLists={setTaxes} />}
                         {formType === 'E' && <ExhibitorForm id={id!} data={eventData} personaldetails={generalData} contactpersondetails={contactPersonData} otherdetails={exhibitorCategoryOption} changePersonalData={setGeneralData} changeContactPersonDetails={setContactPersonData} changeOtherDetails={setExhibitorCategoryOptionCategoryOption} handleSubmit={handleSubmit} paymentDetails={paymentDetails} changePaymentDetails={setPaymentDetails} eventproductsList={eventExibitorProducts} updateEventProductList={setEventExibitorProducts} gstStatus={gstStatus} updateGstStatus={setGstStatus} lists={taxes} setLists={setTaxes} />}
                         {formType === 'S' && <SponsorForm id={id!} data={eventData} personaldetails={generalData} contactpersondetails={contactPersonData} otherdetails={sponsorCategoryOption} changePersonalData={setGeneralData} changeContactPersonDetails={setContactPersonData} changeOtherDetails={setSponsorCategoryOptionCategoryOption} paymentDetails={paymentDetails} changePaymentDetails={setPaymentDetails} handleSubmit={handleSubmit} gstStatus={gstStatus} updateGstStatus={setGstStatus} lists={taxes} setLists={setTaxes} />}
                         {formType === 'P' && <ParticipantsForm />}
                         {alertMsg.includes('id') && <div className="alert alert-success shadow-lg fixed top-5 right-3 w-1/4 md:hidden lg:block hidden">
                              <div>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-current flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                   </svg>
                                   <span>Note : {alertMsg}</span>
                              </div>
                         </div>
                         }
                         <div className="alert alert-warning shadow-lg fixed bottom-28 right-3 w-1/4 md:hidden lg:block hidden">
                              <div>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                   <span>Note for DD Payments : Full Payment should be made by Demand Draft / RTGS in favour of "SITRA, Coimbatore" payable at coimbatore. Account No.50100102513063, Bank Name : HDFC Bank, Branch: Kalapatti Main Road Branch,RTGS / IFSC Code: HDFC 0001068 to to be enclosed to be enclosed with the order form.</span>
                              </div>
                         </div>
                         <div className="alert alert-info shadow-lg fixed bottom-5 right-3 w-1/4 md:hidden lg:block hidden">
                              <div>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                   <span>Note : Do not close this tab until you fill the form and did your payment.</span>
                              </div>
                         </div>

                    </section>
                    : <Loader />
               }

               {alertStatus && !alertMsg.includes('id') && <div className="fixed bottom-0 top-0 w-full"><AlertCard message={alertMsg} func={'closemodal'} closeModal={closeAlertModal} /></div>}

          </>
     )
}
