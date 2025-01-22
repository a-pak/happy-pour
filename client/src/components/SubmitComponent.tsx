import React, { useState } from 'react';
import Bar from '../model/IbarInterface.ts'

interface BarFormProps {
    initialBar: Bar;
    onSubmit: (updatedBar: Bar) => void;
}

const BarForm: React.FC<BarFormProps> = ({ initialBar, onSubmit }) => {
    const [bar, setBar] = useState<Bar>(initialBar);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setBar({ ...bar, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(bar);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={bar.name} onChange={handleChange} />

            <label htmlFor="coordLong">Longitude:</label>
            <input type="number" id="coordLong" name="coordLong" value={bar.coordLong} onChange={handleChange} />

            <label htmlFor="coordLat">Latitude:</label>
            <input type="number" id="coordLat" name="coordLat" value={bar.coordLat} onChange={handleChange} />

            <label htmlFor="address">Address:</label>
            <textarea id="address" name="address" value={bar.address} onChange={handleChange} />

            <label htmlFor="beer05Price">Beer (0.5l) Price:</label>
            <input type="number" id="beer05Price" name="beer05Price" value={bar.beer05Price} onChange={handleChange} />

            <label htmlFor="wine075Price">Wine (0.75l) Price:</label>
            <input type="number" id="wine075Price" name="wine075Price" value={bar.wine075Price} onChange={handleChange} />

            <label htmlFor="coffeePrice">Coffee Price:</label>
            <input type="number" id="coffeePrice" name="coffeePrice" value={bar.coffeePrice} onChange={handleChange} />

            <label htmlFor="entryFee">Entry Fee:</label>
            <input type="number" id="entryFee" name="entryFee" value={bar.entryFee} onChange={handleChange} />

            <label htmlFor="cloakroomFee">Cloakroom Fee:</label>
            <input type="number" id="cloakroomFee" name="cloakroomFee" value={bar.cloakroomFee} onChange={handleChange} />

            <button type="submit">Update Bar</button>
        </form>
    );
};

export default BarForm;