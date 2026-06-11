import { useEffect, useState } from "react";

export default function TablaPreview() {
	const [data, setData] = useState<string[][]>([]);

	useEffect(() => {
		const loadData = () => {
			const saved = localStorage.getItem("tablaEnviada");
			if (saved) {
			setData(JSON.parse(saved));
			} else {
			setData([]);
			}
		};

		loadData();

		const handleStorage = (e: StorageEvent) => {
			if (e.key === "tablaEnviada") {
			loadData();
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	if (!data.length) return <p>No hay datos aún</p>;
	
	const previewRows = data.slice(0, 3);
	
	return (
	<table border={1} style={{ width: "100%" }}>
		<tbody>
			{previewRows.map((row, i) => (
				<tr key={i}>
					{row.slice(0, 3).map((cell, j) => (
						<td
							key={j}
							style={{
								padding: "2px",
								fontWeight: i === 0 ? "bold" : "normal"
							}}
						>
							{cell || (i === 0 ? `Col ${j + 1}` : "")}
						</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
);
}
