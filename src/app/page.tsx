import {
  Typography,
  Container,
  Checkbox,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import Scan from "@/components/Scan";
import { BellIcon } from "lucide-react";
import ProgressGraph from "@/components/ProgressGraph";
import Calendar from "@/components/Calendar";
import Challenges from "@/components/Challenges";

export default function Home() {
  return (
    <Container>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle1">welcome back</Typography>
          <Typography variant="h1" sx={{ display: "inline", mr: 2 }}>
            John Doe
          </Typography>
        </Box>
        <IconButton aria-label="notifications">
          <BellIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center"}}>
          Weekly Workout Progress
        </Typography>
        <ProgressGraph />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center"}}>
          Challenges
        </Typography>
        <Challenges />
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
      </Box>
    </Container>
  );
}
