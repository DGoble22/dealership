import CarCard from "../components/CarCard.jsx";
import "./Inventory.css";
import {useEffect, useState} from "react";


export default function Inventory({ isAdmin }) {
    const [cars, setCars] = useState([]); //Start with empty cars array
    const [showForm, setShowForm] = useState(false);

    //loads all cars from database
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost/dealership-project/backend/api/get_cars.php");
                const json = await response.json();

                if (json.status === "success") {
                    setCars(json.data);
                }
            } catch (error) {
                console.error("Could not get cars:", error);
            }
        };

        fetchCars();
    }, []);

    return (
        <div className="inventory-page">
            <h1>Current Inventory</h1>
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={() => setShowForm(false)}>Close X</button>
                        <p>Add car</p>
                    </div>
                </div>
            )}

            <div className="car-grid">
                {isAdmin && (
                    <div className="car-card add-plus-card" onClick={() => setShowForm(true)}>
                        <div className="plus-icon">+</div>
                        <h3>Add New Listing</h3>
                    </div>
                )}
                {cars.map((car) => (
                    <CarCard key={car.carid} car={car} isAdmin={isAdmin}/>))}
            </div>
        </div>
    );
};