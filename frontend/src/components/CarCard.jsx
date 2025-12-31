
const CarCard = ({car}) =>  {
    return (
        <div className="car-card">
            <div className="car-image">🚗</div>
            <div className="car-info">
                <h3>{car.year} {car.make} {car.model}</h3>
                <p className="price">${car.price.toLocaleString()}</p>
                <p className="miles">{car.miles} miles</p>
                <button className="details-btn">View Details</button>
            </div>
        </div>
    );
};

export default CarCard;