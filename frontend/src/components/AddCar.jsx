import React, {useCallback, useState} from "react";
import "./CarFourm.css";
import Cropper from "react-easy-crop";
import getCroppedImage from "../cropImage.jsx";

export default function AddCar({onSuccess}) {
    // Data to be sent to backend
    const [finalFiles, setFinalFiles] = useState([]); // holds final cropped image
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
    const [imageSrc, setImageSrc] = useState(null); // holds the image source for cropping
    const [queue, setQueue] = useState([]); // holds original images before cropping
    const [currentQueueIndex, setCurrentQueueIndex] = useState(0); // index of current image being cropped
    const [crop, setCrop] = useState({ x: 0, y: 0}); // cropping aspect ratio
    const [zoom, setZoom] = useState(1); // zoom level for cropping
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // pixel area to be cropped

    const loadNextInQueue = (file) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => setImageSrc(reader.result));
        reader.readAsDataURL(file);
    }

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selected = Array.from(e.target.files);
            setQueue(selected);
            setFinalFiles([]); //reset if user selects new files before finishing cropping
            setCurrentQueueIndex(0);
            loadNextInQueue(selected[0]);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        try{
            if(!imageSrc || !croppedAreaPixels) return;
            const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);

            //add to final array
            const updatedFinalFiles = [...finalFiles, croppedFile];
            setFinalFiles(updatedFinalFiles);

            //move to next in queue or reset if done
            const nextIndex = currentQueueIndex + 1;
            if(nextIndex < queue.length) {
                setCurrentQueueIndex(nextIndex);
                loadNextInQueue(queue[nextIndex]);
                setZoom(1);
            } else {
                //ALl photos cropped, reset states
                setImageSrc(null);
                setQueue([]);
                setZoom(1);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleCancel = () => {
        setImageSrc(null);
        setQueue([]);
        setFinalFiles([]);
    }

    // Helper function to handle changes in form inputs. It updates the formData state with the new values as the user types or selects options. The function uses the name attribute of the input fields to determine which part of the formData to update.
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(finalFiles.length === 0) {
            alert("Please upload and crop at least one photo of the vehicle.");
            return;
        }

        const data = new FormData(); // Container for form data and image file to send to backend
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        finalFiles.forEach((file) => {
            data.append("images[]", file);
        })

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
                <div className="cropper-section">
                    <p>Cropping image {currentQueueIndex + 1} of {queue.length}</p>
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
                    </div>
                    <div className="cropper-btns">
                        <button type="button" onClick={handleSaveCrop} className="crop-save-btn">Save & Next</button>
                        <button type="button" className="crop-cancel-btn" onClick={handleCancel}>Cancel & Restart</button>
                    </div>

                </div>
            ) : (
                <div className="file-input-container">
                    <label>Vehicle Photos:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onFileChange}
                    />
                    {finalFiles.length > 0 && (<p style={{color: 'green', fontSize: '0.8rem'}}>{finalFiles.length} photos ready for upload</p>)}
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

            {/* Extra Forum Elements: Description, cropped image preview, submit */ }
            <textarea name="description" placeholder="Vehicle Details" onChange={handleChange} required />
            {finalFiles.length > 0 && !imageSrc && (
                <div className="thumbnail-preview-strip" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {finalFiles.map((file, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    ))}
                </div>
            )}
            <button type="submit" className="submit-btn" disabled={imageSrc}>
                { imageSrc ? "Finish cropping first!" : "Add to Inventory"}
            </button>
        </form>
    );
}