import { useSearchParams } from "react-router-dom";
import SubmitFormComponent from "../components/SubmitFormComponent.tsx";
import BarSubmitComponent from "../components/BarSubmitComponent.tsx";

export const AddPage : React.FC = () => {
  const [searchParams] = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  const lat = latParam ? parseFloat(latParam) : undefined;
  const long = lngParam ? parseFloat(lngParam) : undefined;

  return (
    <div>
        <BarSubmitComponent lat={lat} lng={long}/>
    </div>
  )
}
