import type { DisplayData } from "./DisplayData";
import './DataDisplays.module.css'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper} from "@mui/material";

interface DataTableAttributes {
    data: DisplayData[];
}

function DataTable({data}: DataTableAttributes) {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: 1250, margin: "auto", mt: 3}}>
            <Table>
                <TableHead>
                    <TableCell align="center">State</TableCell>
                    <TableCell align="center">Population</TableCell>
                    <TableCell align="center">Mail In</TableCell>
                </TableHead>
                <TableBody>
                    {data.map((x) => (
                        <TableRow key={x.state}>
                            <TableCell align="center">{x.state}</TableCell>
                            <TableCell align="center">{x.population}</TableCell>
                            <TableCell align="center">{x.mailin}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
