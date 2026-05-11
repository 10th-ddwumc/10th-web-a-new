import { Link } from "react-router-dom";

const Footer = () => {
    return <footer className="p-4 shadow-sm py-6mt-12">
        <div className="container mx-auto text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Spinning Music. All rights reserved.</p>

            <div className="flex justify-center mt-4 gap-4">
                <Link to={"#"}>Privacy Policy</Link>
                <Link to={"#"}>Terms of Service</Link>
                <Link to={"#"}>Contact Us</Link>
            </div>
        </div>
    </footer>
}

export default Footer;

