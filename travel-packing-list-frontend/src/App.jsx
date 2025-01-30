import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";
import Auth from "./pages/Auth";

function App() {
    return (
        <Router>
            <Navbar />
            <div className='p-4'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/trips' element={<Trips />} />
                    <Route path='/trips/:id' element={<TripDetails />} />
                    <Route path='/auth' element={<Auth />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
