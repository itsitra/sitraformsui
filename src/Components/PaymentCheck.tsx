import { useState } from "react"
import useHttp from "../hooks/useHttp"
import AlertCard from "./AlertCard"
type PaymentComponentProps = {
     closeModal: Function,
     paymentDetails: {
          amount: number,
          bankname: string,
          dd_utr: string,
          date: string,
     },
     changePaymentDetails: Function,
     formtype: string,
     amount: number,
     custname: string,
     custemail: string,
     custmobile: number,
     changeAmount: Function,
     lists: { type: string, tax: number, selected: boolean }[],
     setLists: Function,
     generalDetails: object
}

export default function PaymentCheck({ closeModal, paymentDetails, changePaymentDetails, formtype, amount, custname, custemail, custmobile, changeAmount, lists, setLists, generalDetails }: PaymentComponentProps) {
     let [paymenttype, setPaymentType] = useState<string>('')
     const [alertStatus, setAlertStatus] = useState<boolean>(false)
     const [alertMsg, setAlertMsg] = useState<string>('')
     const [formName, setFormName] = useState<string>(formtype.startsWith('E') ? "Exhibitor Form Payment" : formtype.startsWith('A') ? 'Advertisor Form Payment' : formtype.startsWith('S') ? 'Sponsor Form Payment' : 'Visitor Form Payment')
     const { Post: handlePaymentPOST, OtherPost: generateOrderID, OtherPost: sendMail, OtherPost: insertNeft, OtherGet: downloadReceipt } = useHttp()


     const handlePaymentSubmit = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
          e.preventDefault()
          if (type !== 'online') {
               if (amount !== 0 && paymentDetails.bankname !== '' && paymentDetails.date !== '' && paymentDetails.dd_utr !== '') {
                    if ((sessionStorage.getItem('userID') !== '' || sessionStorage.getItem('userID') !== null) && formtype.startsWith('E')) {
                         let jdata: string | object = JSON.stringify({ ...paymentDetails, type: 'E', id: sessionStorage.getItem('userID'), paymenttype: 'bank', eventid: sessionStorage.getItem('eventid'), amount: amount })
                         handlePaymentPOST('/addpayment', jdata).then((res) => {
                              if (res.message === "Payment Saved") {
                                   let maildata: string = JSON.stringify({
                                        "toemail": custemail,
                                        "subject": "Sitra Event Registration",
                                        "message": `You Registration for Sitra event is successful, and you bank payment data for amount ${sessionStorage.getItem("eventcost")} is received successfully.Your Eventid is ${sessionStorage.getItem('userID')} use this id as reference id for any queries. Thank you for your interest  
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        Mr. R. Indrajith, Head -Business Development
                                        The South India Textile Research Association
                                        Coimbatore - 641014
                                        Cell:8883890300, 9865302143,9791847170,9500836663
                                        Phone: 0422-4215343,333
                                        Email: bdm@sitra.org.in,bdmsupport@sitra.org.in
                                        Website:www.sitra.org.in`
                                   })
                                   sendMail(`http://sitraonline.org.in/onlineserviceapi/index.php/api/sendmail?t=e`, maildata).then((res) => {
                                        if (res.data) {
                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setAlertMsg('Payment Details Saved')
                                             setAlertStatus(true)
                                             insertNeft(`http://sitraonline.org.in/onlineserviceapi/index.php/api/neftPayment`, JSON.stringify({
                                                  ...generalDetails,
                                                  ddAmount: sessionStorage.getItem("eventcost"),
                                                  ddUtrNo: paymentDetails.dd_utr,
                                                  custid: sessionStorage.getItem("userID"),
                                                  bankName: paymentDetails.bankname,
                                                  ddDate: paymentDetails.date,
                                                  orderType: 7

                                             })).then((res) => {
                                                  let tid = res.data.tid;
                                                  if (res.data.id !== '') {
                                                       downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${res.data.id}`).then((res) => {
                                                            if (res.data === 'success') {
                                                                 closeModal()
                                                                 window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                            }
                                                       })
                                                  }
                                             })
                                        } else {
                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setAlertMsg('Payment Details Saved but error sending mail. Contact Sitra for more info')
                                             setAlertStatus(true)
                                             insertNeft(`http://sitraonline.org.in/onlineserviceapi/index.php/api/neftPayment`, JSON.stringify({
                                                  ...generalDetails,
                                                  ddAmount: sessionStorage.getItem("eventcost"),
                                                  ddUtrNo: paymentDetails.dd_utr,
                                                  custid: sessionStorage.getItem("userID"),
                                                  bankName: paymentDetails.bankname,
                                                  ddDate: paymentDetails.date,
                                                  orderType: 7

                                             })).then((res) => {
                                                  let tid = res.data.tid;
                                                  if (res.data.id !== '') {
                                                       downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${res.data.id}`).then((res) => {
                                                            if (res.data === 'success') {
                                                                 closeModal()
                                                                 window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                            }
                                                       })
                                                  }
                                             })
                                        }
                                   }).catch((err) => alert(err))

                              }
                         }).catch((err) => {
                              alert(err)
                         })

                    } else if ((sessionStorage.getItem('userID') !== '' || sessionStorage.getItem('userID') !== null) && formtype.startsWith('A')) {
                         let jdata: string | object = JSON.stringify({ ...paymentDetails, type: 'A', id: sessionStorage.getItem('userID'), paymenttype: 'bank', eventid: sessionStorage.getItem('eventid'), amount: amount })
                         handlePaymentPOST('/addpayment', jdata).then((res) => {
                              if (res.message === "Payment Saved") {
                                   let maildata: string = JSON.stringify({
                                        "toemail": custemail,
                                        "subject": "Sitra Event Registration",
                                        "message": `You Registration for Sitra event is successful, and you bank payment data for amount ${sessionStorage.getItem("eventcost")} is received successfully.Your Eventid is ${sessionStorage.getItem('userID')} use this id as reference id for any queries. Thank you for your interest
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        Mr. R. Indrajith, Head -Business Development
                                        The South India Textile Research Association
                                        Coimbatore - 641014
                                        Cell:8883890300, 9865302143,9791847170,9500836663
                                        Phone: 0422-4215343,333
                                        Email: bdm@sitra.org.in,bdmsupport@sitra.org.in
                                        Website:www.sitra.org.in`
                                   })
                                   sendMail(`http://sitraonline.org.in/onlineserviceapi/index.php/api/sendmail?t=e`, maildata).then((res) => {
                                        if (res.data) {
                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setAlertMsg('Payment Details Saved')
                                             setAlertStatus(true)
                                             insertNeft(`http://sitraonline.org.in/onlineserviceapi/index.php/api/neftPayment`, JSON.stringify({
                                                  ...generalDetails,
                                                  ddAmount: sessionStorage.getItem("eventcost"),
                                                  ddUtrNo: paymentDetails.dd_utr,
                                                  custid: sessionStorage.getItem("userID"),
                                                  bankName: paymentDetails.bankname,
                                                  ddDate: paymentDetails.date,
                                                  orderType: 7

                                             })).then((res) => {
                                                  let tid = res.data.tid;
                                                  if (res.data.id !== '') {
                                                       downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${res.data.id}`).then((res) => {
                                                            if (res.data === 'success') {
                                                                 closeModal()
                                                                 window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                            }
                                                       })
                                                  }
                                             })

                                        } else {
                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setAlertMsg('Payment Details Saved but error sending mail. Contact Sitra for more info')
                                             setAlertStatus(true)
                                             insertNeft(`http://sitraonline.org.in/onlineserviceapi/index.php/api/neftPayment`, JSON.stringify({
                                                  ...generalDetails,
                                                  ddAmount: sessionStorage.getItem("eventcost"),
                                                  ddUtrNo: paymentDetails.dd_utr,
                                                  custid: sessionStorage.getItem("userID"),
                                                  bankName: paymentDetails.bankname,
                                                  ddDate: paymentDetails.date,
                                                  orderType: 7

                                             })).then((res) => {
                                                  let tid = res.data.tid;
                                                  if (res.data.id !== '') {
                                                       downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${res.data.id}`).then((res) => {
                                                            if (res.data === 'success') {
                                                                 closeModal()
                                                                 window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                            }
                                                       })
                                                  }
                                             })
                                        }
                                   }).catch((err) => alert(err))
                              }
                         }).catch((err) => {
                              alert(err)
                         })
                    } else if ((sessionStorage.getItem('userID') !== '' || sessionStorage.getItem('userID') !== null) && formtype.startsWith('S')) {
                         let jdata: string | object = JSON.stringify({ ...paymentDetails, type: 'S', id: sessionStorage.getItem('userID'), paymenttype: 'bank', eventid: sessionStorage.getItem('eventid'), amount: amount })
                         handlePaymentPOST('/addpayment', jdata).then((res) => {
                              if (res.message === "Payment Saved") {
                                   let maildata: string = JSON.stringify({
                                        "toemail": custemail,
                                        "subject": "Sitra Event Registration",
                                        "message": `You Registration for Sitra event is successful, and you bank payment data for amount ${sessionStorage.getItem("eventcost")} is received successfully.Your Eventid is ${sessionStorage.getItem('userID')} use this id as reference id for any queries. Thank you for your interest  
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        Mr. R. Indrajith, Head -Business Development
                                        The South India Textile Research Association
                                        Coimbatore - 641014
                                        Cell:8883890300, 9865302143,9791847170,9500836663
                                        Phone: 0422-4215343,333
                                        Email: bdm@sitra.org.in,bdmsupport@sitra.org.in
                                        Website:www.sitra.org.in`
                                   })
                                   sendMail(`http://sitraonline.org.in/onlineserviceapi/index.php/api/sendmail?t=e`, maildata).then((res) => {
                                        if (res.data) {

                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setAlertMsg('Payment Details Saved')
                                             setAlertStatus(true)
                                             insertNeft(`http://sitraonline.org.in/onlineserviceapi/index.php/api/neftPayment`, JSON.stringify({
                                                  ...generalDetails,
                                                  ddAmount: sessionStorage.getItem("eventcost"),
                                                  ddUtrNo: paymentDetails.dd_utr,
                                                  custid: sessionStorage.getItem("userID"),
                                                  bankName: paymentDetails.bankname,
                                                  ddDate: paymentDetails.date,
                                                  orderType: 7

                                             })).then((res) => {
                                                  let tid = res.data.tid;
                                                  if (res.data.id !== '') {
                                                       downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${res.data.id}`).then((res) => {
                                                            if (res.data === 'success') {
                                                                 closeModal()
                                                                 window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                            }
                                                       })
                                                  }
                                             })

                                        } else {
                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setAlertMsg('Payment Details Saved but error sending mail. Contact Sitra for more info')
                                             setAlertStatus(true)
                                             insertNeft(`http://sitraonline.org.in/onlineserviceapi/index.php/api/neftPayment`, JSON.stringify({
                                                  ...generalDetails,
                                                  ddAmount: sessionStorage.getItem("eventcost"),
                                                  ddUtrNo: paymentDetails.dd_utr,
                                                  custid: sessionStorage.getItem("userID"),
                                                  bankName: paymentDetails.bankname,
                                                  ddDate: paymentDetails.date,
                                                  orderType: 7

                                             })).then((res) => {
                                                  let tid = res.data.tid;
                                                  if (res.data.id !== '') {
                                                       downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${res.data.id}`).then((res) => {
                                                            if (res.data === 'success') {
                                                                 closeModal()
                                                                 window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                            }
                                                       })
                                                  }
                                             })
                                        }
                                   }).catch((err) => alert(err))
                              }
                         }).catch((err) => {
                              alert(err)
                         })
                    } else {
                         closeModal()
                    }
               } else {
                    setAlertMsg('Enter All Fields')
                    setAlertStatus(true)
               }
          } else {
               let checkPaymentMoethod: any = checkListSelected()
               if (typeof checkPaymentMoethod === "boolean") {
                    alert("Select Card Type")
               } else {
                    generateOrderId()
               }
          }
     }

     const generateOrderId = (): void => {
          let jdata: string = JSON.stringify(
               { "data": { "customerid": sessionStorage.getItem("userID"), "webinarid": sessionStorage.getItem('eventid'), "orderdetails": { "amount": amount, "receipt": custname, "orderType": "webinar", ...generalDetails }, "ordertype": 7 } }
          );
          generateOrderID(`http://sitraonline.org.in/onlineserviceapi/index.php/api/insert_webinar_transcations/`, jdata).then((res) => {
               if (res.data.order_id) {
                    openRazorPay(amount, res.data.order_id, custname, custemail, custmobile)
               }
          }).catch((err) => {
               alert(err)
          })
     }

     const openRazorPay = (amount: number, orderid: string, name: string, emailid: string, mobile: number): void => {
          let options = {
               key: "rzp_live_8czpfGU7PWoKVA",
               amount: amount,
               currency: "INR",
               name: "SITRA",
               description: formName,
               image: "http://sitraonline.org.in/images/sitralogo.jpg",
               order_id: orderid,
               callback_url:
                    "http://sitraonline.org.in/onlineserviceapi/index.php/api/sitraEventPayments",
               prefill: {
                    name: name,
                    email: emailid,
                    contact: mobile,
               },
               notes: {
                    address: "Sitra 13/37, Avinashi Road, Coimbatore Aerodrome Post",
               },
               theme: {
                    color: "#3399cc",
               },
          };
          const razorPay = new window.Razorpay(options);
          razorPay.open();
     }


     function checkListSelected() {
          let index: number;
          lists.forEach((l, i) => {
               if (l.selected === true) {
                    index = i;
               }
          });
          if (typeof index! !== "number") {
               return false;
          }
          return index!;
     }

     function enableProceed(tax: number, i: number) {
          lists.forEach(l => {
               l.selected = false
          });
          lists[i].selected = true
          setLists(lists)
          changeAmount(tax, Number(sessionStorage.getItem("eventcost")))
     }

     return (
          <>
               <div className="fixed shadow-2xl rounded-xl p-5 bg-blue-300 text-white w-10/12 md:w-1/3 h-max z-50 lg:w-1/4  sm:top-5 lg:top-0">
                    <div id="carddetails">
                         <div className="flex items-center justify-between" id="cardaction">
                              <h1 id="cardheading" className="text-xl font-bold ">Payment Details</h1>
                              <span className="cursor-pointer" onClick={() => closeModal()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              </span>
                         </div>
                         <hr className="my-2" />
                         <div id="paymentoptions" className="space-y-3">
                              <details id="personaldetails" className="rounded-lg shadow-xl" onClick={() => setPaymentType('online')}>
                                   <summary className="text-xl font-bold tracking-wide text-blue-500 bg-blue-200 p-5 rounded-lg">ONLINE PAYMENT</summary>
                                   <form id="bankpaymentform" className="p-2 text-black">
                                        <div className="form-control w-full">
                                             <label className="label">
                                                  <span className="label-text">Amount</span>
                                             </label>
                                             <input type="number" placeholder="Amount" className="input input-bordered w-full input-disabled" readOnly defaultValue={amount} key={amount} />
                                             {/* onChange={(e) => changePaymentDetails({ ...paymentDetails, amount: e.target.value })} */}
                                        </div>
                                        {lists && lists.map((l, i) => <div className="form-control w-full" key={i}>
                                             <label className="label">
                                                  <span className="label-text text-white font-bold">{l.type.toUpperCase()}</span>
                                                  <span className="label-text-alt  font-bold">{l.tax}% of tax will be charaged on total amount</span>
                                                  <input type="radio" name="paymenttype" value={l.tax} onChange={(e: any) => enableProceed(Number(e.target.value), i)} className="radio radio-primary" />
                                             </label>
                                        </div>)}
                                        <div id="paymentaction" className="form-control mb-10 my-5 flex items-center justify-center">
                                             <button className="btn btn-info text-lg text-blue-50 w-1/2" onClick={(e) => handlePaymentSubmit(e, 'online')}> <span className="flex items-center justify-center gap-2"><span>Proceed</span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                             </svg>
                                             </span></button>
                                        </div>
                                   </form>

                              </details>
                              <details id="personaldetails" className="rounded-lg shadow-xl" onClick={(e) => setPaymentType('bank')}>
                                   <summary className="text-xl font-bold tracking-wide text-blue-500 bg-blue-200 p-5 rounded-lg">DD/ NEFT Payments Fill Details</summary>
                                   <form id="bankpaymentform" className="p-2 text-black">
                                        <p className="text-white">Full Payment should be made by Demand Draft / RTGS in favour of "SITRA, Coimbatore" payable at coimbatore. Account No.50100102513063, Bank Name : HDFC Bank, Branch: Kalapatti Main Road Branch,RTGS / IFSC Code: HDFC 0001068 to to be enclosed to be enclosed with the order form.</p>
                                        <div className="form-control w-full">
                                             <label className="label">
                                                  <span className="label-text">Amount</span>
                                             </label>
                                             <input type="number" placeholder="Amount" className="input input-bordered w-full input-disabled" readOnly defaultValue={sessionStorage.getItem("eventcost")!} />
                                             {/* onChange={(e) => changePaymentDetails({ ...paymentDetails, amount: e.target.value })} */}
                                        </div>
                                        <div className="form-control w-full">
                                             <label className="label">
                                                  <span className="label-text">Bank Name</span>
                                             </label>
                                             <input type="text" placeholder="Bank Name" className="input input-bordered w-full" value={paymentDetails.bankname} onChange={(e) => changePaymentDetails({ ...paymentDetails, bankname: e.target.value })} />
                                        </div>
                                        <div className="form-control w-full">
                                             <label className="label">
                                                  <span className="label-text">D.D/UTR No</span>
                                             </label>
                                             <input type="text" placeholder="Enter your D.D or UTR Number" className="input input-bordered w-full " value={paymentDetails.dd_utr} onChange={(e) => changePaymentDetails({ ...paymentDetails, dd_utr: e.target.value })} />
                                        </div>
                                        <div className="form-control w-full">
                                             <label className="label">
                                                  <span className="label-text">Date</span>
                                             </label>
                                             <input type="date" placeholder="Type here" className="input input-bordered w-full " value={paymentDetails.date} onChange={(e) => changePaymentDetails({ ...paymentDetails, date: e.target.value })} />
                                        </div>
                                        <div id="paymentaction" className="form-control mb-10 my-5 flex items-center justify-center">
                                             <button className="btn btn-info text-lg text-blue-50 w-1/2" onClick={(e) => handlePaymentSubmit(e, 'bank')}>Submit</button>
                                        </div>
                                   </form>
                              </details>
                         </div>
                    </div>
               </div>
               {alertStatus && <div className="fixed z-50 border-2 w-full"><AlertCard message={alertMsg} func="closemodal" closeModal={setAlertStatus} /></div>}
          </>
     )
}

// function selectPaymentMethod({ amount, list }: {
//      amount: number,
//      list: object[]
// }) :React.FunctionComponent{
//      const lists = [{
//           type: "card",
//           tax: 1.5
//      }, {
//           type: "Debit lt 2000",
//           tax: 0.4
//      }, {
//           type: "Debit gt 2000",
//           tax: 0.55
//      }, {
//           type: "NetBanking",
//           tax: 1.45
//      }]
//      return (
//           <>
//                {list && lists.map((l) => <input type="radio" name="paymenttype" value={l.tax} onChange={(e: any) => e.target.value * amount / 100} />)}
//           </>
//      )
// }