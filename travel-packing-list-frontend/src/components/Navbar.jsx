import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className='bg-blue-500 p-4 text-white flex justify-between'>
            <Link to='/' className='font-bold text-xl'>
                Travel Packing
            </Link>
            <div>
                <Link to='/trips' className='mx-2 hover:underline'>
                    Voyages
                </Link>
                <Link to='/auth' className='mx-2 hover:underline'>
                    Connexion
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
