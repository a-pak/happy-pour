import React from 'react'
import { useSearchParams } from "react-router-dom";
import BarForm from "../components/BarForm.tsx";

export const AddPage : React.FC = () => {
  const [searchParams] = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  const lat = latParam ? parseFloat(latParam) : undefined;
  const long = lngParam ? parseFloat(lngParam) : undefined;

  return (
    <div>
        <BarForm lat={lat} lng={long}/>
    </div>
  )
}
