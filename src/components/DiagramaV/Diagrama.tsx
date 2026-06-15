import { useEffect, useRef } from "react";
import "./Diagrama.css";
import PdfButton from "./PdfBoton";
import logo from "../../assets/DiagramaV/logo-usm.png";
import  TablaPreview from  "./Tabla/TablaPreview";
import { EcuacionPreview } from "./Ecuaciones/EcuacionPreview";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Diagrama() {
	useEffect(() => {
		document.title = "DiagramaV";
	}, []);

	const tablaWindow = useRef<Window | null>(null);
	const openTabla = () => {
		const base = import.meta.env.BASE_URL;
		if (!tablaWindow.current || tablaWindow.current.closed) {
			tablaWindow.current = window.open(`${base}tabla`, "tablaWindow");
		} else {
			tablaWindow.current.focus();
		}
	};
	
	const ecuacionesWindow = useRef<Window | null>(null);
	const openEcuaciones = () => {
		const base = import.meta.env.BASE_URL;
		if (!ecuacionesWindow.current || ecuacionesWindow.current.closed) {
			ecuacionesWindow.current = window.open(`${base}ecuaciones`, "ecuacionesWindow");
		} else {
			ecuacionesWindow.current.focus();
		}
	};
	
	const transformacionesWindow = useRef<Window | null>(null);
	const openTransformaciones = () => {
		const base = import.meta.env.BASE_URL;
		if (!transformacionesWindow.current || transformacionesWindow.current.closed) {
			transformacionesWindow.current = window.open(`${base}transformaciones`, "transformacionesWindow");
		} else {
			transformacionesWindow.current.focus();
		}
	};

	const graficosWindow = useRef<Window | null>(null);
	const openGraficos = () => {
		const base = import.meta.env.BASE_URL;
		if (!graficosWindow.current || graficosWindow.current.closed) {
			graficosWindow.current = window.open(`${base}graficos`, "graficosWindow");
		} else {
			graficosWindow.current.focus();
		}
	};

	const imagenesWindow = useRef<Window | null>(null);
	const openImagenes = () => {
		const base = import.meta.env.BASE_URL;
		if (!imagenesWindow.current || imagenesWindow.current.closed) {
			imagenesWindow.current = window.open(`${base}imagenes`, "imagenesWindow");
		} else {
			imagenesWindow.current.focus();
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
							maxLength={100}
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
						<div className="concept-buttons-center">
							<p>Preguntas Foco</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Preguntas que sirven para enfocar la búsqueda de la información sobre los eventos/objetos (Límite de caracteres: 280)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
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
						<div className="concept-buttons">
							<p>Teorías</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Conjunto(s) organizado(s) de principios y conceptos que guían la producción de conocimientos, explicando por qué los eventos u objetos exhiben lo que es observado (Límite de caracteres: 450)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="left-1-input"
							placeholder="Teorías"
							maxLength={450}
						/>
					</div>
					<div className="left-down">
						<div className="concept-buttons">
							<p>Ecuaciones</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Ecuaciones propias emanadas de la teoría que ayudan a abordar o resolver la problemática en las transformaciones (Límite de caracteres: 500)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="left-2-input"
							placeholder="Ecuaciones"
							maxLength={500}
						/>
						<EcuacionPreview storageKey="ecuacionesData" align="left" />
						<button
							className="no-pdf"
							onClick={openEcuaciones}
						>
							Editar ecuaciones
						</button>
						
						<div className="concept-buttons">
							<p>Conceptos</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Regularidades percibidas en eventos y objetos indicadas por un rótulo (la palabra concepto), (Límite de caracteres: 220)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="left-3-input"
							placeholder="Conceptos"
							maxLength={220}
						/>
					</div>
					
					<div className="right-top">
						<p><b>Dominio Metodológico</b></p>
					</div>
					<div className="right">
						<div className="concept-buttons-right">
							<p>Conclusiones</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Enunciados que responden la(s) pregunta(as) foco y que son interpretaciones razonables de los registros y de las transformaciones metodológicas hechas a la luz del dominio conceptual (Límite de caracteres: 450)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="right-1-input"
							placeholder="Conclusiones"
							maxLength={450}
						/>
					</div>
					<div className="right-down">

						<div className="concept-buttons-right">
							<p>Transformaciones</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"En esta sección se interpretan los resultados obtenidos, comparándolos con valores teóricos o esperados, identificando tendencias, relaciones o discrepancias, y evaluando su validez a partir de los datos experimentales (Límite de caracteres: 250)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="right-2-input"
							placeholder="Transformaciones"
							maxLength={250}
						/>

						<div style={{ display: "flex", justifyContent: "space-between", width: "84.5%" }}>
							<button className="no-pdf" onClick={openGraficos}>
								Agregar gráficos
							</button>
							<button className="no-pdf" onClick={openImagenes}>
								Agregar imagenes
							</button>
						</div>

						<EcuacionPreview storageKey="transformacionesData" align="right" />
						<button
							className="no-pdf"
							onClick={openTransformaciones}
						>
							Editar transformaciones
						</button>
						
						<div className="concept-buttons-right">
							<p>Registros</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Observaciones hechas y registradas de los eventos u objetos estudiados (datos crudos) (Límite de caracteres: 220)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="right-3-input"
							placeholder="Registros"
							maxLength={220}
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
						<div className="concept-buttons-center">
							<p>Eventos/Objetos</p>
							<Tooltip className="no-pdf" title={<span style={{ fontSize: "15px" }}>{"Descripción del (de los) evento(s) u objeto(s) a ser estudiado(s) a fin de responder la(s) pregunta(s) (Límite de caracteres: 1000)."}</span>}arrow>
								<IconButton size="small">
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
						<textarea
							className="bottom-input"
							placeholder="Eventos/Objetos"
							maxLength={1000}
						/>
					</div>
				</div>
			</div>
			
			<PdfButton targetId="report" />
		</div>
	);
}
