import * as React from 'react';
import {useParams} from "react-router-dom";
import PriceSubmitComponent from '../components/PriceSubmitComponent.tsx';

//        <SubmitFormComponent initialBarId={realId} />

const UpdatePage: React.FC = () => {
  const { id } = useParams();
  function submitComponentRender() {
    if(id !== undefined) {
      const realId : number = Number(id);
      return (
        <>
        <PriceSubmitComponent barId = {realId} />
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

export default UpdatePage;
