import React from "react";
import type { DisplayData } from "./DisplayData";
import './DataDisplays.css'

interface DataTableAttributes {
    data: DisplayData[];
}

const DataTable: React.FC<DataTableAttributes> = ({data}) => {
    return (
        <table style={{width: "100%"}}>
            <thead>
                <tr>
                    <th>State</th>
                    <th>Population</th>
                    <th>Mail-In</th>
                </tr>
            </thead> 
            <tbody>
                {data.map(x => (
                    <tr key={x.state}>
                    <td>{x.state}</td>
                    <td>{x.population}</td>
                    <td>{x.mailin}</td>
                    </tr>
                ))}
            </tbody>   
        </table>
    );
};

export default DataTable;