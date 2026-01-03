import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "./CarDetails.css";

export default function CarDetails() {
    const id = useParams().id;
    const [car, setCar] = useState(null);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try{
                const response = await fetch(`http://localhost/dealership-project/backend/api/get_car_by_id.php?id=${id}`);
                const result = await response.json();
                if (result.status === "success") {
                    setCar(result.data);
                } else {
                    console.error("Error fetching car details: ", result.message);
                }
            } catch (error) {
                console.error("Loading Failed: ",error);
            }
        }
        fetchCarDetails();
    }, [id])

    if (!car) return null;

    return (
        <div className="car-details-container">
            <div className="car-details-card">
                {/* Header */}
                <div className="car-header">
                    <h1>{car.year} {car.make} {car.model}</h1>
                    {car.trim && <h2>{car.trim}</h2>}
                </div>

                {/* Stock Photo */}
                <div className="car-image">
                    <img src="https://picsum.photos/1200/800" alt="Car" />
                </div>

                {/* Details */}
                <div className="car-info">
                    <p><strong>Price</strong> <span>${car.price?.toLocaleString()}</span></p>
                    <p><strong>Mileage</strong> <span>{car.miles?.toLocaleString()} mi</span></p>
                    <p><strong>VIN</strong> <span>{car.vin}</span></p>
                    <p><strong>Status</strong> <span>{car.status}</span></p>
                </div>

                {/* Description */}
                {car.description && (
                    <div className="car-description">
                        <h3>Description</h3>
                        <p>{car.description}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="car-actions">
                    <button className="btn-back" onClick={() => window.history.back()}>
                        ← Back to Inventory
                    </button>
                    <button className="btn-edit" onClick={() => alert('Edit coming soon!')}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );

}