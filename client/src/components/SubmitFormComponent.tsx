import React, {useEffect, useState} from 'react';
import Bar from '../model/IbarInterface.ts'
import {defaultBar} from '../model/IbarInterface.ts'
import BarService from '../services/bars.ts'
import {Box, Button, Grid2, IconButton, TextField, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Link, useNavigate} from "react-router-dom";

interface SubmitFormProps {
    initialBarId?: number;
    lng?: number;
    lat?: number;
}
const SubmitFormComponent: React.FC<SubmitFormProps> = ({ lng, lat, initialBarId }) => {
    const isUpdate : boolean = initialBarId !== undefined;
    const [bar, setBar] = useState<Bar>(defaultBar);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
         if(initialBarId !== undefined) {
             console.log("initialBarId ", initialBarId);
            BarService.getById(initialBarId).then(
                (bar) => {
                    setBar(bar);
                }
            ).catch((err) => {
                setError("Could not get bar with id. " + err + "")
            })
        } else {
            if(lng !== undefined && lat !== undefined) {
                setBar({
                    ...bar,
                    coordLong: lng,
                    coordLat: lat
                });
            }
        }
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        event.preventDefault();
        setBar({ ...bar, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(isUpdate) {
            BarService.update(bar).then(() => {
                navigate("/")}).catch((err) => {
                    console.log(err);
                    setError("Could not update bar. " + err + "")
            });
        } else {
            BarService.create(bar).catch((err) => {
                console.log(err);
                setError("Could not create bar. " + err + "")

            });
        }
    };

    return (
        <div style={{padding: '20px'}}>


            {error && <Typography color="error">{error}</Typography>}


            <form onSubmit={handleSubmit}>
                <Box sx={{flexGrow: 1}}>
                    <Grid2 container spacing={1}>


                        <Grid2>
                            <Typography variant="h5" gutterBottom>
                                Add or Update
                            </Typography>
                        </Grid2>
                        <Grid2>
                            <Link to="/">
                                <IconButton aria-label="delete" size="large"
                                            sx={{color: 'text.primary', position: 'relative', left: '20px',}}>
                                    <CloseIcon fontSize="inherit"/>
                                </IconButton>
                            </Link>
                        </Grid2>

                        <>
                            <Grid2>
                                <TextField
                                    fullWidth
                                    label="Bar Name"
                                    color='secondary'
                                    name="name"
                                    value={bar.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid2>

                            <Grid2>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={bar.address}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid2>
                            <Grid2>
                                <TextField
                                    fullWidth
                                    label="Longitude"
                                    name="coordLong"
                                    value={bar.coordLong}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </Grid2>
                            <Grid2>
                                <TextField
                                    fullWidth
                                    label="Latitude"
                                    name="coordLat"
                                    value={bar.coordLat}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </Grid2>


                        </>
                        <Grid2>
                            <TextField
                                fullWidth
                                label="Beer (0.5L) Price"
                                name="beer05Price"
                                type="number"
                                value={bar.beer05Price}
                                onChange={handleChange}
                            />
                        </Grid2>

                        <Grid2>
                            <TextField
                                fullWidth
                                label="Wine (0.75L) Price"
                                name="wine075Price"
                                type="number"
                                value={bar.wine075Price}
                                onChange={handleChange}

                            />
                        </Grid2>

                        <Grid2>
                            <TextField
                                fullWidth
                                label="Coffee Price"
                                name="coffeePrice"
                                type="number"
                                value={bar.coffeePrice}
                                onChange={handleChange}
                            />
                        </Grid2>

                        <Grid2>
                            <TextField
                                fullWidth
                                label="Entry Fee"
                                name="entryFee"
                                type="number"
                                value={bar.entryFee}
                                onChange={handleChange}
                            />
                        </Grid2>

                        <Grid2>
                            <TextField
                                fullWidth
                                label="Cloakroom Fee"
                                name="cloakRoomFee"
                                type="number"
                                value={bar.cloakroomFee}
                                onChange={handleChange}
                            />
                        </Grid2>


                        <Grid2>
                            <Button type="submit" variant="contained" color="secondary" fullWidth>
                                Submit
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>
            </form>
        </div>
    );
};

export default SubmitFormComponent;