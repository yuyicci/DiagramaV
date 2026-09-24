import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import Box from "@mui/material/Box";
import TeacherLogin from "./pages/TeacherLogin.tsx";
import Diagrama from "./components/DiagramaV/Diagrama.tsx";
import Tabla from "./components/DiagramaV/Tabla/Tabla.tsx";
import Ecuaciones from "./components/DiagramaV/Ecuaciones/Ecuaciones.tsx";
import Graficos from "./components/DiagramaV/Graficos/Graficos.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import TeacherPanel from "./pages/TeacherPanel.tsx";
import TeacherRoute from "./components/TeacherRoute.tsx";
import StudentStart from "./pages/StudentStart.tsx";
import Home from "./pages/Home.tsx";
import TeacherRegister from "./pages/TeacherRegister.tsx";
import TeacherEntry from "./pages/TeacherEntry.tsx";

function App() {
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Header />

			<Box sx={{ flex: 1, overflow: "auto" }}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/student" element={<StudentStart />} />
					<Route path="/profesor" element={<TeacherEntry />} />
					<Route path="/teacher" element={<TeacherRoute> <TeacherPanel /> </TeacherRoute>} />
					<Route path="/teacher/login" element={<TeacherLogin />} />
					<Route path="/teacher/register" element={<TeacherRegister />} />
					<Route path="/diagramav" element={<Diagrama />} />
					<Route path="/diagramav/default" element={<Diagrama />} />
					<Route path="/diagramav/tabla" element={<Tabla />} />
					<Route path="/diagramav/ecuaciones" element={<Ecuaciones storageKey="ecuacionesData" />} />
					<Route path="/diagramav/transformaciones" element={<Ecuaciones storageKey="transformacionesData" />} />
					<Route path="/diagramav/graficos" element={<Graficos storageKey="graficosData" />} />
					<Route path="/diagramav/imagenes" element={<Graficos storageKey="imagenesData" />} />
					<Route path="/admin" element={<AdminRoute> <Admin /> </AdminRoute>} />
					<Route path="/admin/login" element={<AdminLogin />} />
				</Routes>
			</Box>
		</Box>
	);
}

export default App;
