import React from "react";
import { Spinner } from "react-bootstrap";

export interface ILoadingProps {}

export const Loading: React.FC<ILoadingProps> = props => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 170,
                borderBottom: "1px solid #e9ecef",
            }}
            className="align-middle"
        >
            <Spinner style={{ marginBottom: 20 }} animation="border" role="status" /> Loading Data
            From Server
        </div>
    );
};
