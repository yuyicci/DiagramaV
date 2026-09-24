import { useEffect, useState } from "react";
import "mathlive";

const MathField = 'math-field' as any;

type Props = {
	storageKey: string;
	align?: "left" | "right";
};

export function EcuacionPreview({ storageKey, align = "left" }: Props) {
	const [ecuaciones, setEcuaciones] = useState<string[]>([]);
	const isRight = align === "right";
	
	useEffect(() => {
		const load = () => {
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				try {
					const arr = JSON.parse(saved);
					if (isRight){
						setEcuaciones(arr.slice(0, 6).map((e: any) => e.value));
					} else {
						setEcuaciones(arr.slice(0, 9).map((e: any) => e.value));
					}
				} catch {
					setEcuaciones([]);
				}
			}
		};
		
		load();
		
		window.addEventListener("storage", load);
		window.addEventListener("ecuacionesUpdated", load);
		
		return () => {
			window.removeEventListener("storage", load);
			window.removeEventListener("ecuacionesUpdated", load);
		};
	}, [storageKey]);
	
	const indexMap = isRight ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6, 7, 8];
	
	const mapped = indexMap.map((i) => ({
		value: ecuaciones[i],
		number: i + 1,
	})).filter((item) => item.value);
	
	return (
		<div
			style={{
				height: isRight ? "100px" : "180px",
				width: isRight ? "538px" : "580px",
				overflow: "hidden",
				border: "1px solid #777",
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gridTemplateRows: isRight ? "1fr 1fr" : "1fr 1fr 1fr",
				padding: "5px"
			}}
		>
			{mapped.map((item, i) => (
				<div
					key={i}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "4px",
						overflow: "hidden",
						justifyContent: isRight ? "flex-end" : "flex-start"
					}}
				>
					<span style={{ fontSize: "15px" }}>
						{item.number}.- 
					</span>
				
					<MathField
						read-only
						value={item.value}
						style={{
							border: "none",
							width: "100%",
							fontSize: "15px",
							textAlign: isRight ? "right" : "left"
						}}
					/>
				</div>
			))}
		</div>
	);
}
