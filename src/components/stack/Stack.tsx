import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

type StackComponentProps = {
    data: string[];
};

const StackComponent = ({ data }: StackComponentProps) => {
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f5ca69",
        ...theme.typography.h6,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));

    const content = data.map(item => {
        return <Item>{item}</Item>;
    });

    return (
        <Box sx={{ width: "25%", fontSize: "14px", marginLeft: "auto" }}>
            <Stack spacing={1}>{content}</Stack>
        </Box>
    );
};

export default StackComponent;
