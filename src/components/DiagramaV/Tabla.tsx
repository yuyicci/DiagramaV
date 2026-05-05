import { useState, useEffect } from "react";
import "./Tabla.css";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Tabla() {
	useEffect(() => {
		document.title = "Tabla";
	}, []);

	const [data, setData] = useState(() => {
		const saved = localStorage.getItem("tablaData");
		return saved ? JSON.parse(saved) : [["", ""], ["", ""]];
	});
	
	
	useEffect(() => {
		localStorage.setItem("tablaData", JSON.stringify(data));
	}, [data]);

	const updateCell = (row, col, value) => {
		const newData = data.map((r, i) =>
			r.map((c, j) => (i === row && j === col ? value : c))
		);
		setData(newData);
	};

	const addRow = () => {
		const cols = data[0]?.length || 1;
		setData([...data, Array(cols).fill("")]);
	};

	const deleteRow = (rowIndex) => {
		setData(data.filter((_, i) => i !== rowIndex));
	};

	const addColumn = () => {
		setData(data.map(row => [...row, ""]));
	};

	const deleteColumn = (colIndex) => {
		setData(data.map(row => row.filter((_, j) => j !== colIndex)));
	};

	return (
		<div style={{ padding: 20 }}>
			<div style={{ marginBottom: 10 }}>
				<button onClick={addRow}>Agregar fila</button>
				<button onClick={addColumn}>Agregar columna</button>
			</div>

			<table border="1">
				<thead>
					<tr>
						{data[0]?.map((_, colIndex) => (
							<th key={colIndex}>
								Columna {colIndex + 1}
								<IconButton
									onClick={() => deleteColumn(colIndex)}
								>
									<DeleteIcon />
								</IconButton>
							</th>
						))}
						<th>Filas</th>
					</tr>
				</thead>

				<tbody>
					{data.map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => (
								<td key={j}>
									<textarea
										value={cell}
										maxLength={15}
										onChange={(e) => updateCell(i, j, e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
											}
										}}
										rows={1}
										style={{
											width: "100%",
											resize: "none",
											overflow: "hidden"
										}}
										onInput={(e) => {
											const textarea = e.target;
											
											textarea.style.height = "auto";
											textarea.style.height = textarea.scrollHeight + "px";
										}}
									/>
								</td>
							))}
							<td>
								<IconButton
									size="small"
									onClick={() => deleteRow(i)}
								>
									<DeleteIcon fontSize="inherit"/>
								</IconButton>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
