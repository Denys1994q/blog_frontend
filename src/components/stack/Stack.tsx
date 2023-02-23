import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

type StackComponentProps = {
    data: string[];
};

const StackComponent = ({ data }: StackComponentProps) => {
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff59d",
        ...theme.typography.h6,
        padding: theme.spacing(1),
        textAlign: "center",
        fontWeight: "bold",
        color: theme.palette.text.secondary,
    }));

    const content = data.map(item => {
        return <Item sx={{ ".MuiPaper-root": { marginLeft: "0" } }}>{item}</Item>;
    });

    return (
        <Grid container sx={{ fontSize: "14px" }}>
            <Stack direction='row' sx={{ flexWrap: "wrap", gap: "10px" }}>
                {content}
            </Stack>
        </Grid>
    );
};

export default StackComponent;
