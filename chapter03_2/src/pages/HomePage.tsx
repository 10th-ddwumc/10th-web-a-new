import { Outlet } from "react-router-dom"
import { Navbar } from "../componentss/Navbar";

export default function HomePage() {
        return (
            <>
            <Navbar />
            <Outlet />
            </>
    );
};