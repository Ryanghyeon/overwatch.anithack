// src/routes.jsx
import { Home, Login, Register, Report, Ranking, Admin, Profile } from "@/pages";

export const routeList = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/report", element: <Report /> },
    { path: "/ranking", element: <Ranking /> },
    { path: "/admin", element: <Admin /> },
    { path: "/profile", element: <Profile /> },
    { path: "/profile/:uid", element: <Profile /> },
];