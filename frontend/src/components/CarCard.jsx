import "./CarCard.css";

const CarCard = ({car, isAdmin}) =>  {
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

    return (
        <div className="car-card">
            {isAdmin && (
                <button className="delete-btn" onClick={handleDelete}>&times;</button>
            )}
            <div className="car-image">
                <img src="https://picsum.photos/300/200" alt="Car" />
            </div>
            <div className="car-info">
                <span className={`status-badge status-${car.status.toLowerCase()}`}>
                    {car.status}
                </span>
                <h3>{car.year} {car.make} {car.model}</h3>
                <p className="car-price">${Number(car.price).toLocaleString()}</p>
                <div className="car-details-row">
                    <span>{car.trim}</span>
                    <span>{Number(car.miles).toLocaleString()} miles</span>
                </div>
            </div>
        </div>
    );
};

export default CarCard;