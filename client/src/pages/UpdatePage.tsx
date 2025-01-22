import * as React from 'react';
import BarForm from "../components/BarForm.tsx";
import {useParams} from "react-router-dom";

const UpdatePage: React.FC = () => {
  const { barId } = useParams();
  function submitComponentRender() {
    if(barId !== undefined) {
      return (
        <BarForm initialBarId={Number(barId)} /> // Why does this work?
      )
    }
    return (
        <BarForm initialBarId={undefined} />
    )
  }

  return (
      <div className="wrapper">
        { submitComponentRender() }
      </div>
  )
}

export default UpdatePage;
