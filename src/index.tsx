import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Form from './Pages/Form';
import Payment from './Pages/Payment';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router basename="/sitraevents">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/event/:id" element={<Form />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="*" element={<div className='h-screen m-auto flex flex-col gap-5 items-center justify-center text-9xl font-bold font-serif  text-black'>
        <div className='flex items-center justify-center gap-2'><h1>404</h1><p className='mt-16 md:mt-28 h-5 w-5 bg-black'></p></div>
        <p className='text-4xl'>Oooops!</p>
        <Link to={'/'} className="btn btn-warning">Go Home</Link>
      </div>} />
    </Routes>
  </Router>
);
