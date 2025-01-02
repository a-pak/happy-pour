import { Outlet } from "react-router-dom";
import AppBarComponent from "./AppBarComponent";

const LayoutComponent = () => {

    return (
        <>
            <AppBarComponent />
            <Outlet />
        </>
    )
}
export default LayoutComponent;