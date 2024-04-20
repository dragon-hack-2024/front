import {Typography, Container, Checkbox} from "@mui/material";
import Scan from "@/components/Scan";

export default function Home() {
    return (
        <Container>
            <Typography variant={"h1"}>
                Title
            </Typography>
            <Checkbox/>
            <Scan/>
        </Container>
    );
}
