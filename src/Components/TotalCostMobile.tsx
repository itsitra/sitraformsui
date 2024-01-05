type TotalCostMobileComponentProps = {
     cost: number,
     openmodal?: Function
}
export default function TotalCostMobile({ cost, openmodal }: TotalCostMobileComponentProps) {
     function handlemodal() {
          if (sessionStorage.getItem("userID") !== null && sessionStorage.getItem('paymentstatus') !== 'Success') {
               openmodal!(true)
          }
          if (sessionStorage.getItem('paymentstatus') === 'Success') {
               if (!("Notification" in window)) {
                    // Check if the browser supports notifications
                    alert("This browser does not support desktop notification");
               } else if (Notification.permission === "granted") {
                    const notification = new Notification("Payment Success");
                    // …
               } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then((permission) => {

                         if (permission === "granted") {
                              const notification = new Notification("Payment Success");
                         }
                    });
               }
          }
     }
     return (
          <div className={cost === 0 ? "w-14 h-14 p-2 bg-blue-200 fixed -top-10 rounded-full mx-2 my-24 right-0 shadow-xl text-blue-700 flex items-center justify-center cursor-pointer" : "w-max h-14 p-2 bg-blue-200 fixed -top-10 rounded-full mx-2 my-24 right-0 shadow-xl text-blue-700 flex items-center justify-center cursor-pointer"} onClick={() => handlemodal()}>
               <div className="relative">
                    <p className="text-base font-bold">{cost === 0 ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                         : <span>&#8377; {cost}</span>}</p>
               </div>
               <div className="h-screen w-1 bg-blue-50 absolute  bottom-14">

               </div>
          </div>

     )
}
