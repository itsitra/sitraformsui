// import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import payment from '../assets/gateway.png'
import useHttp from '../hooks/useHttp';
import AlertCard from '../Components/AlertCard';
export default function Payment() {
     // let navigate = useNavigate();
     let [paymentstatus, setPaymentstatus] = useState<string>('')
     let { OtherPost: getPaymentStatus, Post: paymentUpadte, OtherPost: sendMail, OtherGet: downloadReceipt } = useHttp()
     let [alertFunc, setAlertFunc] = useState<string>()
     useEffect(() => {
          // console.log()
          document.title = 'Payment validation'
          let d = JSON.stringify({
               custid: sessionStorage.getItem('userID'),
          });
          getPaymentStatus(
               `http://sitraonline.org.in/onlineserviceapi/index.php/api/sitraEvents_payment_status`,
               d
          )
               .then((res) => {
                    let paymentid = res.data.id
                    let tid = res.data.tid
                    let today = new Date();
                    let date;
                    let dd = String(today.getDate()).padStart(2, '0');
                    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    let yyyy = today.getFullYear();
                    sessionStorage.setItem('paymentstatus', res.data.res_order_status === '' ? 'Failed' : res.data.res_order_status)
                    date = yyyy + '/' + mm + '/' + dd;
                    if (
                         res.data.res_order_status === "Success"
                    ) {
                         if (res.data.res_order_status !== 'Success') {
                              setPaymentstatus("Payment Canceled")
                              // setAlertFunc('closewindow');
                         } else {
                              setPaymentstatus("Payment Success")
                              // setAlertFunc('closewindow');
                         }
                         // alert('payment')
                         let jdata: string = JSON.stringify({
                              id: res.data.custid,
                              amount: Math.round(res.data.amount),
                              date: date,
                              orderno: res.data.razorpay_order_id,
                              type: localStorage.getItem('formtype'),
                              paymenttype: 'online',
                              eventid: localStorage.getItem('eventid'),
                              paymentstatus: res.data.res_order_status === "" ? "Payment Canceled" : res.data.res_order_status
                         });
                         paymentUpadte('/addpayment', jdata).then((res) => {
                              // console.log(res)
                              if (res.message === 'Payment Success') {
                                   let maildata: string = JSON.stringify({
                                        "toemail": sessionStorage.getItem('custemail'),
                                        "subject": "Sitra Event Registration",
                                        "message": `You Registration for Sitra event is successful, and you online payment data for amount ${res.data.amount} is received successfully.Your Eventid is ${sessionStorage.getItem('userID')} use this id as reference id for any queries. Thank you for your interest
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
                                             setPaymentstatus('Payment Success')
                                             setAlertFunc('closewindow');
                                             downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${paymentid}`).then((res) => {
                                                  if (res.data === 'success') {
                                                       window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                  }
                                             })

                                        } else {
                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setPaymentstatus('Payment Details Saved but error sending mail. Contact Sitra for more info')
                                             setAlertFunc('closewindow');
                                             downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${paymentid}`).then((res) => {
                                                  if (res.data === 'success') {
                                                       window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                  }
                                             })

                                        }
                                   }).catch((err) => alert(err))
                              } else {
                                   setPaymentstatus("Payment Saved")
                              }

                              setAlertFunc('closewindow');
                         }).catch((err) => {
                              alert(err)
                              setAlertFunc('closewindow');
                         })


                    } else {
                         setPaymentstatus("Payment Failed")
                         // setAlertFunc('closewindow');
                         let jdata: string = JSON.stringify({
                              id: res.data.custid,
                              amount: Math.round(res.data.amount),
                              date: date,
                              orderno: res.data.razorpay_order_id,
                              type: localStorage.getItem('formtype'),
                              paymenttype: 'online',
                              eventid: localStorage.getItem('eventid'),
                              paymentstatus: res.data.res_order_status === "" ? "Payment Canceled" : res.data.res_order_status
                         });
                         paymentUpadte('/addpayment', jdata).then((res) => {
                              if (res.message === '') {
                                   let maildata: string = JSON.stringify({
                                        "toemail": sessionStorage.getItem('custemail'),
                                        "subject": "Sitra Event Registration",
                                        "message": `You Registration for Sitra event is unsuccessful.Your Eventid is ${sessionStorage.getItem('userID')} use this id as reference id for any queries. Thank you for your interest  
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
                                             setPaymentstatus("Payment Canceled")
                                             setAlertFunc('closewindow');
                                             downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${paymentid}`).then((res) => {
                                                  if (res.data === 'success') {
                                                       window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                  }
                                             })

                                        } else {

                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setPaymentstatus('Payment Canceled and error sending mail. Contact Sitra for more info')
                                             setAlertFunc('closewindow');
                                             downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${paymentid}`).then((res) => {
                                                  if (res.data === 'success') {
                                                       window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                  }
                                             })

                                        }
                                   }).catch((err) => alert(err))

                              } else {
                                   let maildata: string = JSON.stringify({
                                        "toemail": sessionStorage.getItem('custemail'),
                                        "subject": "Sitra Event Registration",
                                        "message": `You Registration for Sitra event is unsuccessful.Your Eventid is ${sessionStorage.getItem('userID')} use this id as reference id for any queries. Thank you for your interest`
                                   })
                                   sendMail(`http://sitraonline.org.in/onlineserviceapi/index.php/api/sendmail?t=e`, maildata).then((res) => {
                                        if (res.data) {

                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setPaymentstatus("Payment Failed")
                                             setAlertFunc('closewindow');
                                             downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${paymentid}`).then((res) => {
                                                  if (res.data === 'success') {
                                                       window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                  }
                                             })

                                        } else {

                                             sessionStorage.setItem("paymentstatus", "Success")
                                             setPaymentstatus('Payment Canceled and error sending mail. Contact Sitra for more info')
                                             setAlertFunc('closewindow');
                                             downloadReceipt(`http://sitraonline.org.in/onlineserviceapi/index.php/api/download_event_reference/${paymentid}`).then((res) => {
                                                  if (res.data === 'success') {
                                                       window.open(`http://sitraonline.org.in/ukgdownloads/payment_transcations/${tid}.pdf`, '_blank')

                                                  }
                                             })

                                        }
                                   }).catch((err) => alert(err))

                              }
                              setAlertFunc('closewindow');
                         }).catch((err) => {
                              alert(err)
                              setAlertFunc('closewindow');
                         })
                    }
               })
               .catch((err) => console.log(err));
     }, []);



     return (
          <>
               {paymentstatus === "" ? <div className='flex items-center justify-center h-screen  '>
                    <div className='animate-bounce flex flex-col items-center justify-center gap-5'>
                         <img src={payment} alt="paymentvalidating" className='w-32 md:w-52 ' />
                         <p className='text-xl font-bold md:text-3xl'>Validating Payment</p>
                    </div>

               </div> : <AlertCard message={paymentstatus} func={alertFunc} />}
          </>
     )
}
