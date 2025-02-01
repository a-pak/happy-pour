import * as React from 'react';
import SubmitFormComponent from "../components/SubmitFormComponent.tsx";
import {useParams} from "react-router-dom";
import { parse } from 'path';

const UpdatePage: React.FC = () => {
  const { id } = useParams();
  function submitComponentRender() {
    if(id !== undefined) {
      const realId : number = parseInt(id);
      return (
        <SubmitFormComponent initialBarId={realId} />
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
