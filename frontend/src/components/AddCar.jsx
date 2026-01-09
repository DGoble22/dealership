import React, {useCallback, useState} from "react";
import "./CarFourm.css";
import Cropper from "react-easy-crop";
import getCroppedImage from "../cropImage.jsx";

export default function AddCar({onSuccess}) {
    // Data to be sent to backend
    const [file, setFile] = useState(null); // holds final cropped image
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

    // image cropping states
    const [imageSrc, setImageSrc] = useState(null); // holds original image before cropping
    const [crop, setCrop] = useState({ x: 0, y: 0}); // cropping aspect ratio
    const [zoom, setZoom] = useState(1); // zoom level for cropping
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // pixel area to be cropped

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        try{
            if(!imageSrc || !croppedAreaPixels) return;
            const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);
            setFile(croppedFile);
            setImageSrc(null); // close the cropping interface
        } catch (e) {
            console.error(e);
        }
    }

    // Helper function to handle changes in form inputs. It updates the formData state with the new values as the user types or selects options. The function uses the name attribute of the input fields to determine which part of the formData to update.
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(); // Container for form data and image file to send to backend

        //Loops though formData and appends to new formData object
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if(file){ data.append("car_image", file); }

        try{
            const response = await fetch("http://localhost/dealership-project/backend/api/add_car.php", {
                method: "POST",
                body: data,
            });

            const result = await response.json();
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

    // Default Year Values
    const years = Array.from({ length: 2026 - 1950 + 1}, (_, i) => 2026 - i);

    return (
        <form className="car-form" onSubmit={handleSubmit}>

            {/* Form Header */ }
            <h2>Vehicle Details</h2>

            {/* Photo Upload */ }
            {imageSrc ? (
                <div className="cropper-container" style={{position: 'relative', height: 400, width: '100%'}}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                    <button type="button" onClick={handleSaveCrop} className="crop-save-btn">Crop Image</button>
                </div>
            ) : (
                <div className="file-input-container">
                    <label>Vehicle Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    {file && <p style={{color: 'green', fontSize: '0.8rem'}}>Photo ready for upload</p>}
                </div>
            )}

            {/* Form Grid: Make, Model, Trim, Year, Miles, Price, VIN, Status */ }
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

            {/* Extra Forum Elements: Description, submit */ }
            <textarea name="description" placeholder="Vehicle Details" onChange={handleChange} required />
            <button type="submit" className="submit-btn" disabled={imageSrc}>
                { imageSrc ? "Finish cropping first!" : "Add to Inventory"}
            </button>
        </form>
    );
}