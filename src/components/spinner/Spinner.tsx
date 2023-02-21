import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { blueGrey } from "@mui/material/colors";

const Spinner = (): JSX.Element => {
    return (
        <Box sx={{ display: "flex" }}>
            <CircularProgress sx={{color: blueGrey[900]}} value={50} />
        </Box>
    );
};

export default Spinner;
