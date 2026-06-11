import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

type Item = {
  id: string;
  value: string;
  name: string;
};

type Props = {
  storageKey: string;
};

export default function Graficos({ storageKey }: Props) {
    useEffect(() => {
        const title = storageKey === "graficosData" ? "Gráficos" : "Imágenes";
        document.title = title;
    }, [storageKey]);

    const [items, setItems] = useState<Item[]>(() => {
        const draft = localStorage.getItem(storageKey + "_draft");
        const saved = localStorage.getItem(storageKey);
        const source = draft ?? saved;
        return source ? JSON.parse(source) : [];
    });

    useEffect(() => {
        localStorage.setItem(storageKey + "_draft", JSON.stringify(items));
    }, [items, storageKey]);

    const send = () => {
        localStorage.setItem(storageKey, JSON.stringify(items));
        window.close();
    };

    const MAX_SIZE = 2 * 1024 * 1024;
    const MAX_ITEMS = 6;

    const addImages = (files: FileList) => {
        Array.from(files).forEach((file) => {
            
            if (items.length >= MAX_ITEMS) {
                alert(`Máximo ${MAX_ITEMS} imágenes permitidas`);
                return;
            }

            if (!file.type.startsWith("image/")) {
                alert(`${file.name} no es una imagen válida`);
                return;
            }

            if (file.size > MAX_SIZE) {
                alert(`${file.name} es demasiado grande (máx 2MB)`);
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                setItems((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        value: reader.result as string,
                        name: file.name,
                    },
                ]);
            };

            reader.readAsDataURL(file);
        });
    };

    const remove = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const label = storageKey === "graficosData" ? "Agregar gráficos" : "Agregar imágenes";

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label">
                    {label}
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            if (e.target.files) addImages(e.target.files);
                            e.target.value = "";
                        }}
                    />
                </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: 10,
                            borderRadius: 8,
                            position: "relative",
                        }}
                    >
                        <IconButton
                            onClick={() => remove(item.id)}
                            style={{ position: "absolute", top: 5, right: 5 }}
                        >
                            <DeleteIcon />
                        </IconButton>

                        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#666" }}>
                            {item.name}
                        </p>
                        <img
                            src={item.value}
                            style={{ maxWidth: "100%", maxHeight: 300 }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <Button variant="contained" onClick={send}>
                    Enviar
                </Button>
            </div>
        </div>
    );
}