import * as React from 'react';
import {useParams} from "react-router-dom";
import PriceSubmitComponent from '../components/PriceSubmitComponent.tsx';

const PriceSubmitPage: React.FC = () => {
  const {barId, priceDrinkId, hhId} = useParams();
  
  function submitComponentRender() {
    if(barId !== undefined) {
      const realBarId = Number(barId);
      const realpriceDrinkId = priceDrinkId ? Number(priceDrinkId): undefined;
      const realHHId = hhId ? Number(hhId) : undefined;

      return (
        <>
        <PriceSubmitComponent barId = {realBarId}  priceDrinkId={realpriceDrinkId} happyHourId={realHHId} />
        </>
      )
    }
  }

  return (
      <div className="wrapper">
        { submitComponentRender() }
      </div>
  )
}

export default PriceSubmitPage;
