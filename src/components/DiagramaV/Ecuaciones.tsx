import { useState, useRef, useEffect } from "react";
import "mathlive";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

type Ecuacion = {
	id: number;
	value: string;
};

type Props = {
  storageKey: string;
};

export default function Ecuaciones({ storageKey }: Props) {
	useEffect(() => {
		const title = storageKey === "ecuacionesData" ? "Ecuaciones" : "Transformaciones";
		document.title = title;
	}, [storageKey]);

	const [ecuaciones, setEcuaciones] = useState<Ecuacion[]>(() => {
		const saved = localStorage.getItem(storageKey);
		return saved ? JSON.parse(saved) : [{ id: Date.now(), value: "" }];
	});
	
	const refs = useRef<Record<number, any>>({});
	
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(ecuaciones));
		window.dispatchEvent(new Event("ecuacionesUpdated"));
	}, [ecuaciones, storageKey]);
	
	const update = (id: number) => {
		const mf = refs.current[id];
		if (!mf) return;
		
		setEcuaciones((prev) => prev.map((eq) => eq.id === id ? { ...eq, value: mf.value } : eq));
	};
	
	const add = () => {
		const newId = Date.now() + Math.random();
		
		setEcuaciones((prev) => [...prev, { id: newId, value: "" },]);
		
		setTimeout(() => {refs.current[newId]?.focus();}, 0);
	};
	
	const remove = (id: number) => {
		setEcuaciones((prev) =>
			prev.filter((eq) => eq.id !== id)
		);
		
		delete refs.current[id];
	};
	
	return (
		<div style={{ padding: "10px" }}>
			{ecuaciones.map((eq) => (
				<div
					key={eq.id}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "6px",
						marginBottom: "6px"
					}}
				>
			
					<math-field
						ref={(el) => {if (el) refs.current[eq.id] = el;}}
						virtual-keyboard-mode="onfocus"
						onInput={() => update(eq.id)}
						style={{
							display: "block",
							width: "100%",
							fontSize: "16px",
							border: "1px solid #ccc",
							padding: "6px"
						}}
					>
						{eq.value}
					</math-field>
			
					<IconButton
						onClick={() => remove(eq.id)}
						style={{
							height: "32px",
							cursor: "pointer"
						}}
					>
						<DeleteIcon />
					</IconButton>
				</div>
			))}
			
			<Fab
				color="primary"
				onClick={add}
				style={{
					marginTop: "10px",
					cursor: "pointer"
				}}
			>
				<AddIcon />
			</Fab>
		</div>
	);
}
