import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeacherLogin from "./pages/TeacherLogin.tsx";
import Diagrama from "./components/DiagramaV/Diagrama";
import Tabla from "./components/DiagramaV/Tabla/Tabla";
import Ecuaciones from "./components/DiagramaV/Ecuaciones/Ecuaciones";
import Graficos from "./components/DiagramaV/Graficos/Graficos.tsx";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import TeacherPanel from "./pages/TeacherPanel";
import TeacherRoute from "./components/TeacherRoute";
import StudentStart from "./pages/StudentStart";
import Home from "./pages/Home.tsx";
import TeacherRegister from "./pages/TeacherRegister.tsx";
import TeacherEntry from "./pages/TeacherEntry.tsx";

function App() {
  return (
  	<BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
