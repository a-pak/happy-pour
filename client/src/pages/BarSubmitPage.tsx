import { useParams, useSearchParams } from "react-router-dom";
import BarSubmitComponent from "../components/BarSubmitComponent.tsx";

export const BarSubmitPage : React.FC = () => {
  const {barId} = useParams();
  const [searchParams] = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  const lat = latParam ? parseFloat(latParam) : -1;
  const long = lngParam ? parseFloat(lngParam) : -1;

  return barId ? (
    <div>
        <BarSubmitComponent barId={parseInt(barId)} lat={lat} lng={long}/>
    </div>
    ) : (
    <div>
        <BarSubmitComponent lat={lat} lng={long}/>
    </div>
  )
}