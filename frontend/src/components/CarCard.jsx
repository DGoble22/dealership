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
                    <p>
                        <strong>Status</strong>
                        <span className={`status-badge status-${car.status.toLowerCase()}`}>
                            {car.status}
                        </span>
                    </p>
                </div>

                {/* Description */}
                {car.description && (
                    <div className="car-description">
                        <h3>Description</h3>
                        <p>{car.description}</p>
                    </div>
                )}

                {/* Action Buttons */}
                {isAdmin && (
                <div className="car-actions">
                    <button className="btn-delete" onClick={handleDelete}>X</button>
                    <button className="btn-edit" onClick={() => alert('Edit coming soon!')}>
                        Edit
                    </button>
                </div>
                )}
            </div>
    );
};

export default CarCard;