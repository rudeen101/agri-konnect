import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import PrivateRoute from "../components/privateRoute/PrivateRoute";


const MainLayout = ({ children }) => (
    <div className="container">
        <Sidebar />
        <div className="main-content">
            <Header />
            <PrivateRoute>
                {children}
            </PrivateRoute>
        </div>
        {/* <Footer /> */}
    </div>
);

export default MainLayout;
