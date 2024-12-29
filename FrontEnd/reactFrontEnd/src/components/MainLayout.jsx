import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <>
            <Header />
            <div className="mx-5 my-5">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};
export default MainLayout;