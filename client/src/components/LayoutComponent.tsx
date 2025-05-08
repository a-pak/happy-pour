import { Outlet } from "react-router-dom";
import AppBarComponent from "./AppBarComponent";
import { GlobalErrorNotifier } from "./GlobalErrorNotifier";

const LayoutComponent = () => {

    return (
        <>
            <AppBarComponent />
            <GlobalErrorNotifier/>
            <Outlet />
        </>
    )
}
export default LayoutComponent;