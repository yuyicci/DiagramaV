import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

type Props = {
    to?: string;
    text?: string;
};

export default function BackButton({
    to,
    text = "Volver",
}: Props) {
    const navigate = useNavigate();

    const volver = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            type="button"
            variant="text"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={volver}
        >
            {text}
        </Button>
    );
}