import React, {useState} from "react";
import "./AddCar.css";

export default function AddCar({onSuccess}) {
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        trim: "",
        year: "",
        miles: "",
        price: "",
        vin: "",
        status: "Available",
        description: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const responce = await fetch("http://localhost/dealership-project/backend/api/add_car.php", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const result = await responce.json();
            if (result.status === "success") {
                alert(result.message);
                onSuccess(); //Closes modal and refreshes the list
            } else {
                alert(result.message);
            }
        } catch (e) {
            console.error("Submission Failed: ", e);
        }
    };

    const years = Array.from({ length: 2026 - 1950 + 1}, (_, i) => 2026 - i);

    return (
        <form className="add-car-form" onSubmit={handleSubmit}>
            <h2>Vehicle Details</h2>
            <div className="form-grid">
                <input type="text" name="make" placeholder="Make" onChange={handleChange} required />
                <input type="text" name="model" placeholder="Model" onChange={handleChange} required />
                <input type="text" name="trim" placeholder="Trim" onChange={handleChange} required />
                <select name="year" onChange={handleChange} value={formData.year} required>
                    <option value="">Select Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <input type="number" name="miles" placeholder="Miles" onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
                <input type="text" name="vin" placeholder="Vin #" onChange={handleChange} required />
                <select name="status" onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                </select>
            </div>
            <textarea name="description" placeholder="Vehicle Details" onChange={handleChange} required />
            <button type="submit" className="submit-btn">Add to Inventory</button>
        </form>
    );
}