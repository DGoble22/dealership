import {useNavigate} from "react-router-dom";
import "./CarCard.css";

const CarCard = ({car, isAdmin}) =>  {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.stopPropagation();

        if (window.confirm('Delete ' + car.year + ' ' + car.model + '?')) {
            try{
                const response = await fetch(`http://localhost/dealership-project/backend/api/delete_car.php`, {
                method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id: car.carid}),
            });
            const result = await response.json();

            if (result.status === "success") {
                alert(result.message)
                window.location.reload();
            }
            } catch (error){
                console.error("Could not delete car:", error);
            }
        }
    };

    const handleCardClick = () => {
        navigate('/car/'+car.carid);
    };

    return (
        <div className="car-card" onClick={handleCardClick}>
            {isAdmin && (
                <button className="delete-btn" onClick={handleDelete}>&times;</button>
            )}

            {/* Specific class for the card image container */}
            <div className="car-card-image-wrapper">
                <img
                    src="https://picsum.photos/300/200"
                    alt={`${car.year} ${car.model}`}
                    className="car-card-image"
                />
            </div>

            {/* Specific class for the card info section */}
            <div className="car-card-info">
            <span className={`status-badge status-${car.status.toLowerCase()}`}>
                {car.status}
            </span>
                <h3>{car.year} {car.make} {car.model}</h3>
                <p className="car-card-price">${Number(car.price).toLocaleString()}</p>

                <div className="car-card-details-row">
                    <span>{car.trim}</span>
                    <span>{Number(car.miles).toLocaleString()} miles</span>
                </div>
            </div>
        </div>
    );
};

export default CarCard;