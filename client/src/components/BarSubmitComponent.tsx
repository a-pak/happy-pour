import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import barService from "../services/bars";
import {Bar} from "../model/IbarInterface";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  barId?: number | null;
  lat: number;
  lng: number;
};

const BarSubmitComponent: React.FC<Props> = ({ barId, lat, lng }) => {
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
    }
  }, [barId]);

  const handleSubmit = async () => {
    if (!name || !address || !openFrom || !openTo) {
      alert("Täytä kaikki kentät!");
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
      createdBy: {id: 1, username: "admin"},
      updatedBy: {id: 1, username: "admin"},
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (barId) {
        await barService.update(barId, bar);
        alert("Baari päivitetty!");
      } else {
        await barService.create(bar);
        alert("Uusi baari luotu!");
      }
    } catch (error) {
      console.error("Virhe:", error);
      alert("Tapahtui virhe.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">
          {barId ? "Päivitä baari" : "Lisää uusi baari"}
        </Typography>

        <TextField
          label="Nimi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          label="Osoite"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />

        <TimePicker
          label="Auki alkaen"
          value={openFrom}
          onChange={(newValue) => setOpenFrom(newValue)}
        />

        <TimePicker
          label="Auki loppuun"
          value={openTo}
          onChange={(newValue) => setOpenTo(newValue)}
        />

        <TextField
          label="Sisäänpääsymaksu (€)"
          type="number"
          value={entryFee}
          onChange={(e) => setEntryFee(parseFloat(e.target.value))}
        />

        <TextField
          label="Narikkamaksu (€)"
          type="number"
          value={cloakroomFee}
          onChange={(e) => setCloakroomFee(parseFloat(e.target.value))}
        />

        <Button variant="contained" onClick={handleSubmit}>
          {barId ? "Päivitä" : "Luo baari"}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default BarSubmitComponent;