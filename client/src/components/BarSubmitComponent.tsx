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
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserContext.tsx";
import { useErrorStore } from '../store/errorStore.ts';
import theme from "../Theme";

type Props = {
  barId?: number | null;
  lat: number;
  lng: number;
};

const BarSubmitComponent: React.FC<Props> = ({ barId, lat, lng }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { showNotification } = useErrorStore.getState();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [openFrom, setOpenFrom] = useState<Dayjs | null>(dayjs("14:30", "HH:mm"));
  const [openTo, setOpenTo] = useState<Dayjs | null>(dayjs("14:30", "HH:mm"));
  const [entryFee, setEntryFee] = useState(0.0);
  const [cloakroomFee, setCloakroomFee] = useState(0.0);

  useEffect(() => {
    if (barId) {
      barService.getById(barId).then((bar) => {
        setName(bar.name);
        setAddress(bar.address);
        setOpenFrom(dayjs(bar.openFrom, "HH:mm:ss"));
        setOpenTo(dayjs(bar.openTo, "HH:mm:ss"));
        setEntryFee(bar.entryFee);
        setCloakroomFee(bar.cloakroomFee);
      });
    } else {
      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await response.json();
  
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
        } catch (error) {
          console.error("Nominatim-error:", error);
        }
      };
  
      fetchAddress();
    }
  }, [barId, lat, lng]);

  const handleSubmit = async () => {
    if (!name || !address || !openFrom || !openTo) {
      showNotification("Please fill in all fields.", "warning");
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
      entryFee,
      cloakroomFee,
      createdBy: { id: 1, username: "admin" },
      updatedBy: { id: 1, username: "admin" },
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (barId) {
        await barService.update(barId, bar);
        navigate("/bar/" + barId);
        showNotification("Bar updated successfully!", "success");
      } else {
        const response = await barService.create(bar);
        if (response) {
          navigate("/bar/" + response.id);
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
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: theme.palette.grey[700],
            "&:hover": {
              color: theme.palette.error.main,
            },
          }}
        >
          <CloseIcon />
        </IconButton>

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