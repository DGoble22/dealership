import CarCard from "../components/CarCard.jsx";
import "./Inventory.css";

//Mock data to be replaced by the database
const MOCK_CARS = [
    { id: 1, make: "Chevrolet", model: "Tahoe", year: 2023, price: 65000, miles: 12000 },
    { id: 2, make: "GMC", model: "Yukon", year: 2022, price: 58000, miles: 25000 },
    { id: 3, make: "Ford", model: "Expedition", year: 2021, price: 52000, miles: 38000 },
    { id: 4, make: "Cadillac", model: "Escalade", year: 2024, price: 95000, miles: 500 },
];

export default function Inventory() {
    return (
        <div className="inventory-page">
            <h1>Current Inventory</h1>

            <div className="car-grid">
                {MOCK_CARS.map((car) => (<CarCard key={car.id} car={car} />))}
            </div>
        </div>
    );
};