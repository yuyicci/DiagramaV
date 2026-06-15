import { useState, useEffect } from "react";
import "./Tabla.css";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

export default function Tabla() {
	useEffect(() => {
		document.title = "Tabla";
	}, []);

	const [data, setData] = useState<string[][]>(() => {
		const saved = localStorage.getItem("tablaData");
		return saved
			? (JSON.parse(saved) as string[][])
			: [["", ""], ["", ""]];
	});

	useEffect(() => {
		localStorage.setItem("tablaData", JSON.stringify(data));
	}, [data]);

	const send = () => {
		if (data.length === 0) {
			localStorage.removeItem("tablaEnviada");
		} else {
			localStorage.setItem(
			"tablaEnviada",
			JSON.stringify(data)
			);
		}
		
		window.close();
	};

	const updateCell = (row: number, col: number, value: string) => {
		const newData = [...data];
		newData[row] = [...newData[row]];
		newData[row][col] = value;
		setData(newData);
	};

	const addRow = () => {
		const cols = data[0]?.length || 1;
		setData([...data, Array(cols).fill("")]);
	};

	const deleteRow = (rowIndex: number) => {
		setData(data.filter((_, i) => i !== rowIndex));
	};

	const addColumn = () => {
		setData(data.map(row => [...row, ""]));
	};

	const deleteColumn = (colIndex: number) => {
		if (data[0].length <= 1) return;

		setData(data.map(row =>
			row.filter((_, j) => j !== colIndex)
		));
	};

	return (
		<div style={{ padding: 20 }}>
			<div style={{ marginBottom: 10 }}>
				<button onClick={addRow}>Agregar fila</button>
				<button onClick={addColumn}>Agregar columna</button>
			</div>

			<table border={1}>
				<thead>
					<tr>
						<th>Tabla</th>
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
					</tr>
				</thead>

				<tbody>
					{data.map((row, i) => (
						<tr key={i}>
							<td
								style={{
									textAlign: "center",
									fontWeight: "bold",
									verticalAlign: "middle"
								}}
							>
								Fila {i + 1}
								<IconButton
									onClick={() => deleteRow(i)}
									size="small"
								>
									<DeleteIcon fontSize="small"/>
								</IconButton>
							</td>
							{row.map((cell, j) => (
								<td key={j}>
									<textarea
										value={cell}
										maxLength={20}
										onChange={(e) => updateCell(i, j, e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
											}
										}}
										rows={1}
										style={{
											width: "100%",
											height: "30px",
											textAlign: "center",
											resize: "none",
											overflow: "hidden"
										}}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div style={{ marginTop: 10 }}>
				<Button variant="contained" onClick={send}>
					Enviar Tabla
				</Button>
			</div>
		</div>
	);
}
