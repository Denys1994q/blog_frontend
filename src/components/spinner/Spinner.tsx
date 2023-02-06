import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Spinner = (): JSX.Element => {
    return (
        <Box sx={{ display: "flex" }}>
            <CircularProgress color='secondary' value={50} />
        </Box>
    );
};

export default Spinner;
