import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Splash from './component/SplashScreen';
import AdminDashboard from './component/admin';
import CreateMoviePage from './page/movie/movie.jsx'; // Assuming location
import AddFoodItem from './page/food/food.jsx'; // Assuming location
import ScreenCrud from './page/seat/seat.jsx'; // Assuming location
import Schedule from './page/schedule/scedule.jsx'; // Assuming location
import AddCelebToMovie from './page/movie/addceleberity'; // Assuming location
import PackageManagement from './page/offer/offer.jsx'; // Assuming location
import Payments from './page/paymeent/payment.jsx'; // Assuming location
import FeedbackList from './page/other/feedback.js';
import BookingList from './page/other/booking.jsx';
import CreateupMoviePage from './page/movie/upcoming.jsx';
import SlipComponent from './page/paymeent/slip.js';

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark' // Use localStorage or default
  );

  useEffect(() => {
    localStorage.setItem('theme', theme); // Update localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  return (
   
      <div className={`App ${theme}`}>
      <Router>
          <Splash theme={theme} setTheme={toggleTheme} />
         

        <Routes>
          <Route path="/" element={<AdminDashboard theme={theme} />} />
          <Route path="/movie" element={<CreateMoviePage theme={theme} />} />
          <Route path="/food" element={<AddFoodItem theme={theme} />} />
          <Route path="/screen" element={<ScreenCrud theme={theme} />} />
          <Route path="/schedule" element={<Schedule theme={theme} />} />
          <Route path="/celeb" element={<AddCelebToMovie theme={theme} />} />
          <Route path="/package" element={<PackageManagement theme={theme} />} />
          <Route path="/payments" element={<Payments theme={theme} />} />
          <Route path="/feedback" element={<FeedbackList theme={theme} />} />
          <Route path="/booking" element={<BookingList theme={theme} />} />
          <Route path="/up" element={<CreateupMoviePage theme={theme} />} />
          <Route path="slip" element={<SlipComponent theme={theme}  />} />
        </Routes>
        </Router>
      </div>
    
  );
}

export default App;
