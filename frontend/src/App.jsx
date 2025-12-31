import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

//Page Imports
import Inventory from "./pages/Inventory.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

//Main dealership function
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Inventory/>} />
                        <Route path="/AboutUs" element={<AboutUs/>} />
                        <Route path="/AdminPanel" element={<AdminPanel/>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
