import html2pdf from "html2pdf.js";
import Fab from "@mui/material/Fab";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  targetId: string;
};

export default function PdfButton({ targetId }: Props) {
	
	const crearSubtitulo = (texto: string) => {
		const h2 = document.createElement("h2");
		h2.innerText = texto;
		h2.style.marginBottom = "10px";
		h2.style.fontFamily = "Latin Modern Roman";
		h2.style.alignSelf = "flex-start";
		return h2;
	};
	
	const renderEcuaciones = (data: any[], anexo: HTMLElement) => {
		data.forEach((eq, i) => {
			const container = document.createElement("div");
			
			container.style.display = "flex";
			container.style.alignItems = "center";
			container.style.marginBottom = "0px";
			container.style.width = "100%";
			
			const num = document.createElement("span");
			num.textContent = `${i + 1}.`;
			num.style.minWidth = "20px";
			
			const eqDiv = document.createElement("div");
			
			try {
				eqDiv.innerHTML = katex.renderToString(eq.value, {
					throwOnError: false,
					displayMode: true,
				});
			} catch {
				eqDiv.textContent = eq.value;
			}
			
			eqDiv.style.fontSize = "16px";
			
			container.appendChild(num);
			container.appendChild(eqDiv);
			anexo.appendChild(container);
		});
	};
	
	const renderTabla = (data: string[][], anexo: HTMLElement) => {
		const table = document.createElement("table");
		table.style.width = "100%";
		table.style.borderCollapse = "collapse";
		table.style.fontSize = "14px";
		table.style.fontFamily = "Latin Modern Roman";
		
		data.forEach((row, i) => {
			const tr = document.createElement("tr");
			
			row.forEach((cell) => {
				const cellElement = document.createElement(i === 0 ? "th" : "td");
				
				cellElement.innerText = cell;
				cellElement.style.border = "0.3px solid #000";
				cellElement.style.padding = "6px";
				cellElement.style.textAlign = "left";
				
				if (i === 0) {
					cellElement.style.fontWeight = "bold";
				}
				
				tr.appendChild(cellElement);
			});
			
			table.appendChild(tr);
		});
		
		anexo.appendChild(table);
	};
	
	const procesarTextareas = (original: HTMLElement, clone: HTMLElement) => {
		const originalTextareas = original.querySelectorAll("textarea");
		const cloneTextareas = clone.querySelectorAll("textarea");
		
		originalTextareas.forEach((ta, index) => {
			const cloneTa = cloneTextareas[index];
			if (!cloneTa) return;
			
			const div = document.createElement("div");
			const style = window.getComputedStyle(ta);
			
			div.style.whiteSpace = "pre-wrap";
			div.style.wordBreak = "break-word";
			div.style.boxSizing = "border-box";
			div.style.width = ta.getBoundingClientRect().width + "px";
			div.style.height = ta.scrollHeight + "px";
			
			div.style.fontSize = style.fontSize;
			div.style.fontFamily = style.fontFamily;
			div.style.border = style.border;
			div.style.padding = style.padding;
			div.style.textAlign = style.textAlign;
			div.style.fontWeight = style.fontWeight;
			div.style.lineHeight = style.lineHeight;
			
			div.textContent = ta.value;
			
			cloneTa.replaceWith(div);
		});
	};
	
	const procesarMath = (original: HTMLElement, clone: HTMLElement) => {
		const originalMath = original.querySelectorAll("math-field");
		const cloneMath = clone.querySelectorAll("math-field");
		
		originalMath.forEach((mf, i) => {
			const cloneMf = cloneMath[i];
			if (!cloneMf) return;
			
			const latex = (mf as any).value || mf.getAttribute("value") || "";
			
			const div = document.createElement("div");
			
			try {
				div.innerHTML = katex.renderToString(latex, {
					throwOnError: false,
					displayMode: false,
				});
			} catch {
				div.textContent = latex;
			}
			
			div.style.fontSize = "16px";
			
			cloneMf.replaceWith(div);
		});
	};
	
	const convertHtmlPdf = () => {
		const element = document.getElementById(targetId);
		if (!element) return;
		
		const clone = element.cloneNode(true) as HTMLElement;
		
		clone.querySelectorAll(".no-pdf").forEach((el) => el.remove());
		
		procesarTextareas(element, clone);
		procesarMath(element, clone);
		
		const anexo = document.createElement("div");
		
		anexo.classList.add("page-break");
		anexo.style.pageBreakBefore = "always";
		anexo.style.background = "white";
		anexo.style.display = "flex";
		anexo.style.flexDirection = "column";
		anexo.style.alignItems = "center";
		anexo.style.padding = "40px";
		anexo.style.boxSizing = "border-box";
		
		const titulo = document.createElement("h1");
		titulo.innerText = "Anexo";
		titulo.style.marginBottom = "20px";
		titulo.style.fontFamily = "Latin Modern Roman";
		anexo.appendChild(titulo);
		
		anexo.appendChild(crearSubtitulo("Tabla:"));
		const tablaData = localStorage.getItem("tablaData");
		if (tablaData) {
			renderTabla(JSON.parse(tablaData), anexo);
		}
		
		const grid = document.createElement("div");
		grid.style.display = "grid";
		grid.style.gridTemplateColumns = "1fr 1fr";
		grid.style.gap = "20px";
		grid.style.width = "100%";
		grid.style.alignItems = "start";
		
		const colEcuaciones = document.createElement("div");
		colEcuaciones.style.display = "flex";
		colEcuaciones.style.flexDirection = "column";
		colEcuaciones.appendChild(crearSubtitulo("Ecuaciones:"));
		const ecuacionesData = localStorage.getItem("ecuacionesData");
		if (ecuacionesData) {
			renderEcuaciones(JSON.parse(ecuacionesData), colEcuaciones);
		}
		
		const colTransformaciones = document.createElement("div");
		colTransformaciones.style.display = "flex";
		colTransformaciones.style.flexDirection = "column";
		colTransformaciones.appendChild(crearSubtitulo("Transformaciones:"));
		const transformacionesData = localStorage.getItem("transformacionesData");
		if (transformacionesData) {
			renderEcuaciones(JSON.parse(transformacionesData), colTransformaciones);
		}
		
		grid.appendChild(colEcuaciones);
		grid.appendChild(colTransformaciones);
		
		anexo.appendChild(grid);
		
		const wrapper = document.createElement("div");
		wrapper.appendChild(clone);
		wrapper.appendChild(anexo);
		
		const opt = {
			filename: `${document.title}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: {
				scale: 2,
				useCORS: true,
				backgroundColor: "#ffffff",
				scrollY: 0,
			},
			jsPDF: {
				unit: "mm",
				format: "a3",
				orientation: "landscape",
			},
			pagebreak: { mode: ["css", "legacy"] },
		};
		
		html2pdf().set(opt).from(wrapper).save();
	};
	
	return (
		<Fab
			size="medium"
			color="primary"
			onClick={convertHtmlPdf}
			sx={{
				position: "fixed",
				bottom: 20,
				right: 20,
			}}
		>
			<ArrowUpwardIcon />
		</Fab>
	);
}
