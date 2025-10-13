import { useSearchParams } from "react-router-dom";
import BarSubmitComponent from "../components/BarSubmitComponent.tsx";

export const BarSubmitPage : React.FC = () => {
  const [searchParams] = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  const lat = latParam ? parseFloat(latParam) : -1;
  const long = lngParam ? parseFloat(lngParam) : -1;

  return (
    <div>
        <BarSubmitComponent lat={lat} lng={long}/>
    </div>
  )
}