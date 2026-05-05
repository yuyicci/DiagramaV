import { BrowserRouter, Routes, Route } from "react-router-dom";
import Diagrama from "./components/DiagramaV/Diagrama";
import Tabla from "./components/DiagramaV/Tabla"
import Ecuaciones from "./components/DiagramaV/Ecuaciones";

function App() {
  return (
  	<BrowserRouter>
  		<Routes>
        		<Route path="/" element={<Diagrama />} />
        		<Route path="/tabla" element={<Tabla />} />
        		<Route path="/ecuaciones" element={<Ecuaciones storageKey="ecuacionesData" />} />
        		<Route path="/transformaciones" element={<Ecuaciones storageKey="transformacionesData" />} />
        	</Routes>
        </BrowserRouter>
  );
}

export default App;
