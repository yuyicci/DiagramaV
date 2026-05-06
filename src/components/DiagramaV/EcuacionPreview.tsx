import { useEffect, useState } from "react";
import "mathlive";

const MathField = 'math-field' as any;

type Props = {
	storageKey: string;
	align?: "left" | "right";
};

export function EcuacionPreview({ storageKey, align = "left" }: Props) {
	const [ecuaciones, setEcuaciones] = useState<string[]>([]);
	
	useEffect(() => {
		const load = () => {
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				try {
					const arr = JSON.parse(saved);
					setEcuaciones(arr.slice(0, 4).map((e: any) => e.value));
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
	
	const isRight = align === "right";
	
	const indexMap = isRight ? [1, 0, 3, 2] : [0, 1, 2, 3];
	
	const ordered = indexMap.map(i => ecuaciones[i]).filter(Boolean);
	
	const numberMap = indexMap.map(i => i + 1);
	
	return (
		<div
			style={{
				height: "65px",
				width: "570px",
				overflow: "hidden",
				border: "1px solid #777",
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gridTemplateRows: "1fr 1fr",
				padding: "5px"
			}}
		>
			{ordered.map((eq, i) => (
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
					{!isRight && (
						<span style={{ fontSize: "15px" }}>
							{numberMap[i]}
						</span>
					)}
				
					<MathField
						read-only
						value={eq}
						style={{
							border: "none",
							width: "100%",
							fontSize: "15px",
							textAlign: isRight ? "right" : "left"
						}}
					/>
					
					{isRight && (
						<span style={{ fontSize: "15px" }}>
							{numberMap[i]}
						</span>
					)}
				</div>
			))}
		</div>
	);
}
