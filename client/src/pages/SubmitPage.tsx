import * as React from 'react';
import SubmitComponent from "../components/SubmitComponent.tsx";
import Bar from "../model/IbarInterface.ts";
import update from "../services/bars.ts";
import create from "../services/bars.ts";

interface SubmitPageProps {
  bar: Bar;
  isUpdate: boolean;
}
const SubmitPage: React.FC<SubmitPageProps> = ({ bar, isUpdate }) => {
  function submitComponentRender() {
    if (isUpdate) {
      return <SubmitComponent initialBar={bar} onSubmit={update} />
    }
    return <SubmitComponent initialBar={bar} onSubmit={create} />
  }

  return (
      <div className="wrapper">
        {submitComponentRender()}

      </div>
  )
}

export default SubmitPage;
