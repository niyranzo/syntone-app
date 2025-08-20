// importaciones
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import { ROUTES } from "./path";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Admin from "../pages/admin/Admin";
import User from "../pages/User";
import ProtectedRoute from "../components/ProtectedRouter";
import Animal from "../pages/animal/Animal";
import Diagnostic from "../pages/animal/Diagnostic";
import Analysis from "../pages/animal/Analysis";
import Vaccination from "../pages/Vaccination";
import Register from "../pages/Register";
import Edit from "../pages/admin/Edit";
import NewAnimal from "../pages/admin/NewAnimal";
import UserAnim from "../pages/admin/UserAnim";
import Consultation from "../pages/admin/Consultation";
import DiagnosisUpload from "../pages/admin/DiagnosisUpload";
import AnalysisUpload from "../pages/admin/AnalysisUpload";
import History from "../pages/admin/History";
import Appointments from "../pages/admin/Appoinments";
import PublicRouter from "../components/PublicRouter";
// const url = import.meta.env.VITE_API_URL;
// const pokemonUrl = import.meta.env.VITE_POKEMON;



export const router = createBrowserRouter([
    { //cada uno es una ruta
        element:<RootLayout />,
        errorElement:<ErrorPage />,
        children: [ 
            {
                path: ROUTES.HOME, 
                element: 
                <PublicRouter>
                    <Home />
                </PublicRouter>
            },
            {
                path: ROUTES.LOGIN, 
                element: 
                <PublicRouter>
                    <Login />
                </PublicRouter>
            },
            {
                path: ROUTES.REGISTER, 
                element: 
                <PublicRouter>
                    <Register />
                </PublicRouter>
            },
            
        ]
    },
]);