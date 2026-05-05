import { useEffect, useRef } from "react";
import "./Diagrama.css";
import PdfButton from "./PdfBoton";
import logo from "../../assets/DiagramaV/logo-usm.png";
import  TablaPreview from  "./TablaPreview";
import { EcuacionPreview } from "./EcuacionPreview";

export default function Diagrama() {
	useEffect(() => {
		document.title = "DiagramaV";
	}, []);

	const tablaWindow = useRef(null);
	const openTabla = () => {
		if (!tablaWindow.current || tablaWindow.current.closed) {
			tablaWindow.current = window.open("/tabla", "tablaWindow");
		} else {
			tablaWindow.current.focus();
		}
	};
	
	const ecuacionesWindow = useRef(null);
	const openEcuaciones = () => {
		if (!ecuacionesWindow.current || ecuacionesWindow.current.closed) {
			ecuacionesWindow.current = window.open("/ecuaciones", "ecuacionesWindow");
		} else {
			ecuacionesWindow.current.focus();
		}
	};
	
	const transformacionesWindow = useRef(null);
	const openTransformaciones = () => {
		if (!transformacionesWindow.current || transformacionesWindow.current.closed) {
			transformacionesWindow.current = window.open("/transformaciones", "transformacionesWindow");
		} else {
			transformacionesWindow.current.focus();
		}
	};

	return (
		<div className="container">
			<div id="report">
				<div className="gowin">
					<div className="v-container">
						<div className="v-right"></div>
						<div className="v-left"></div>
						<div className="v-line l1"></div>
						<div className="v-line l2"></div>
					</div>
					
					<div className="title">
						<textarea
							className="title-input"
							placeholder="Título de la Experiencia"
							maxLength={120}
						/>
					</div>
					
					<div className="header-left">
						<img src={logo} alt="Logo USM" className="logo" />
					</div>
					
					<div className="header-right">
						<p>
							Universidad Técnica Federico Santa María<br />
							Laboratorio de Experimentos Remotos
						</p>
					</div>
					
					<div className="middle">
						<p>Preguntas Foco</p>
						<textarea
							className="middle-input"
							placeholder="Preguntas Foco"
							maxLength={280}
						/>
					</div>
					
					<div className="left-top">
						<p><b>Dominio Conceptual</b></p>
					</div>
					<div className="left">
						<p>Teorías</p>
						<textarea
							className="left-1-input"
							placeholder="Conjunto(s) organizado(s) de principios y conceptos que guían la producción de conocimientos, explicando por qué los eventos u objetos exhiben lo que es observado."
							maxLength={400}
						/>
					</div>
					<div className="left-down">
						<p>Ecuaciones</p>
						<textarea
							className="left-2-input"
							placeholder="Ecuaciones propias emanadas de la teoría que ayudan a abordar o resolver la problemática en las transformaciones."
							maxLength={250}
						/>
						<EcuacionPreview storageKey="ecuacionesData" align="left" />
						<button
							className="no-pdf"
							onClick={openEcuaciones}
						>
							Editar ecuaciones
						</button>
						
						<p>Conceptos</p>
						<textarea
							className="left-3-input"
							placeholder="Regularidades percibidas en eventos y objetos indicadas por un rótulo (la palabra concepto)."
							maxLength={200}
						/>
					</div>
					
					<div className="right-top">
						<p><b>Dominio Metodológico</b></p>
					</div>
					<div className="right">
						<p>Conclusiones</p>
						<textarea
							className="right-1-input"
							placeholder="Enunciados que responden la(s) pregunta(as) foco y que son interpretaciones razonables de los registros y de las transformaciones metodológicas hechas a la luz del dominio conceptual."
							maxLength={400}
						/>
					</div>
					<div className="right-down">
						<p>Transformaciones</p>
						<textarea
							className="right-2-input"
							placeholder="En esta sección se interpretan los resultados obtenidos, comparándolos con valores teóricos o esperados, identificando tendencias, relaciones o discrepancias, y evaluando su validez a partir de los datos experimentales."
							maxLength={250}
						/>
						<EcuacionPreview storageKey="transformacionesData" align="right" />
						<button
							className="no-pdf"
							onClick={openTransformaciones}
						>
							Editar transformaciones
						</button>
						
						<p>Registros</p>
						<textarea
							className="right-3-input"
							placeholder="Observaciones hechas y registradas de los eventos u objetos estudiados (datos crudos)."
							maxLength={200}
						/>
							
						<div className="tabla-preview-container">
							<TablaPreview />
						</div>
						<button
							className="no-pdf"
							onClick={() => openTabla()}
							style={{ marginTop: "0px" }}
						>
							Editar tabla
						</button>
						
					</div>
					
					<div className="bottom">
						<p>Eventos/Objetos</p>
						<textarea
							className="bottom-input"
							placeholder="Descripción del (de los) evento(s) u objeto(s) a ser estudiado(s) a fin de responder la(s) pregunta(s)."
							maxLength={1000}
						/>
					</div>
				</div>
			</div>
			
			<PdfButton targetId="report" />
		</div>
	);
}
