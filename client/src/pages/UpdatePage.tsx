import * as React from 'react';
import SubmitFormComponent from "../components/SubmitFormComponent.tsx";
import {useParams} from "react-router-dom";
import DrinkSubmitComponent from '../components/DrinkSubmitComponent.tsx';

//        <SubmitFormComponent initialBarId={realId} />

const UpdatePage: React.FC = () => {
  const { id } = useParams();
  function submitComponentRender() {
    if(id !== undefined) {
      const realId : number = Number(id);
      return (
        <>
        <DrinkSubmitComponent id = {realId} />
        </>
      )
    }
    return (
        <SubmitFormComponent initialBarId={undefined} />
    )
  }

  return (
      <div className="wrapper">
        { submitComponentRender() }
      </div>
  )
}

export default UpdatePage;
