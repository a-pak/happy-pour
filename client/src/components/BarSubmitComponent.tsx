import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import barService from "../services/bars";
import Bar from "../model/IbarInterface";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore.ts";
import { useErrorStore } from '../store/errorStore.ts';
import theme from "../Theme";
import { getAddress } from "../services/geocode.ts";
import { ArrowBack } from "@mui/icons-material";

type Props = {
  barId?: number | null;
  lat: number;
  lng: number;
};

const BarSubmitComponent: React.FC<Props> = ({ barId, lat, lng }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { showNotification } = useErrorStore.getState();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [openFrom, setOpenFrom] = useState<Dayjs | null>(dayjs("14:30", "HH:mm"));
  const [openTo, setOpenTo] = useState<Dayjs | null>(dayjs("14:30", "HH:mm"));
  //const [entryFee, setEntryFee] = useState(0.0);
  //const [cloakroomFee, setCloakroomFee] = useState(0.0);

  useEffect(() => {
    if (barId) {
      barService.getById(barId).then((bar) => {
        setName(bar.bar.name);
        setAddress(bar.bar.address);
        setOpenFrom(dayjs(bar.bar.openFrom, "HH:mm:ss"));
        setOpenTo(dayjs(bar.bar.openTo, "HH:mm:ss"));
      });
    } else {
      const fetchAddress = async () => {
        try {
          const response = await getAddress(lat, lng);
          if(response) {

            if (response.status != 200 || !response.data) {
              console.error('Request failed:', response.status);
              throw new Error('Reverse geocoding failed');
            }
            const data = response.data
    
            if (data && data.address) {
              const addr = data.address;
    
              const road = addr.road || "";
              const houseNumber = addr.house_number || "";
              const postcode = addr.postcode || "";
              const city = addr.city || addr.town || addr.village || "";
    
              const formattedAddress = [road, houseNumber, postcode, city]
                .filter(Boolean)
                .join(" ");
    
              setAddress(formattedAddress);
            } else {
              console.warn("Address not found from Nominatimista.");
            }
          }
         } catch (error) {
          console.error("Nominatim-error:", error);
        }      
      }
      fetchAddress();
    }
  }, [barId, lat, lng]);

  const handleSubmit = async () => {
    if (!name || !address || !openFrom || !openTo) {
      showNotification("Please fill in all fields.", "warning");
      return;
    }

    if(!user) {
      showNotification("You must be logged in to submit a bar.", "warning");
      navigate("/login");
      return;
    }

    const now = new Date().toISOString();

    const bar: Bar = {
      id: barId ?? 0,
      name,
      coordLong: lng,
      coordLat: lat,
      address,
      openFrom: openFrom.format("HH:mm:ss"),
      openTo: openTo.format("HH:mm:ss"),
      //entryFee,
      //cloakroomFee,
      createdBy: user.username,
      updatedBy: user.username,
      createdAt: now,
      updatedAt: now,
      creatorId: user.id
    };

    try {
      if (barId) {
        await barService.update(barId, bar);
        navigate("/bars/" + barId);
        showNotification("Bar updated successfully!", "success");
      } else {
        const response = await barService.create(bar);
        if (response) {
          navigate("/bars/" + response.id);
          showNotification("Bar created successfully!", "success");
        } else {
          throw new Error("No bar in response");
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error.status === 401 || error.status === 403) {
        setUser(null);
        navigate("/login");
        showNotification("Session expired. Please log in again.", "warning");
      } else {
        showNotification("An error occurred while submitting the form. Please try again.");
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          margin: "4vh auto",
          padding: 4,
          position: "relative",
          borderRadius: 4,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Button component={Link} to={`/`} variant="outlined" sx={{ mb: 2 }} startIcon={<ArrowBack/>} >Back to Map </Button>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          {barId ? "Update Bar" : "Add Bar"}
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />

          <TimePicker
            label="Open from"
            value={openFrom}
            onChange={(newValue) => setOpenFrom(newValue)}
          />

          <TimePicker
            label="Open to"
            value={openTo}
            onChange={(newValue) => setOpenTo(newValue)}
          />
          {/*
          <TextField
            label="Entry fee (€)"
            type="number"
            value={entryFee}
            onChange={(e) => setEntryFee(parseFloat(e.target.value))}
          />
          
          <TextField
            label="Cloakroom fee (€)"
            type="number"
            value={cloakroomFee}
            onChange={(e) => setCloakroomFee(parseFloat(e.target.value))}
          />
          */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            sx={{
              mt: 1,
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            {barId ? "Update" : "Create Bar"}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default BarSubmitComponent;