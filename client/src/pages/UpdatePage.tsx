import * as React from 'react';
import SubmitFormComponent from "../components/SubmitFormComponent.tsx";
import {useParams} from "react-router-dom";

const UpdatePage: React.FC = () => {
  const { barId } = useParams();
  function submitComponentRender() {
    if(barId !== undefined) {
      return (
        <SubmitFormComponent initialBarId={Number(barId)} /> // Why does this work?
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
