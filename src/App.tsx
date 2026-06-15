import { BrowserRouter, Routes, Route } from "react-router-dom";
import Diagrama from "./components/DiagramaV/Diagrama";
import Tabla from "./components/DiagramaV/Tabla/Tabla";
import Ecuaciones from "./components/DiagramaV/Ecuaciones/Ecuaciones";
import Graficos from "./components/DiagramaV/Graficos/Graficos.tsx";

function App() {
  return (
  	<BrowserRouter>
  		<Routes>
        	<Route path="/" element={<Diagrama />} />
        	<Route path="/tabla" element={<Tabla />} />
        	<Route path="/ecuaciones" element={<Ecuaciones storageKey="ecuacionesData" />} />
        	<Route path="/transformaciones" element={<Ecuaciones storageKey="transformacionesData" />} />
			<Route path="/graficos" element={<Graficos storageKey="graficosData" />} />
			<Route path="/imagenes" element={<Graficos storageKey="imagenesData" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
