import React from "react";
import { DataStore } from "../models/DataStore";
import { observer } from "mobx-react";
import { Button } from "react-bootstrap";
import { IPatientDeviceProps } from "../PatientDevice";
import { Store } from "../Store";

export interface IDataProviderProps {
    store: Store;
    model: DataStore;
}

export function WithDataProvider(Component: React.ComponentType<IPatientDeviceProps>) {
    class DataProvider extends React.Component<IDataProviderProps> {
        renderBody() {
            if (!this.props.model.isActive) {
                return (
                    <Button size="lg" onClick={this.props.model.setActive}>
                        Login
                    </Button>
                );
            } else if (!this.props.model.state) {
                return "Loading profile and data";
            } else if (this.props.model.state) {
                return <Component data={this.props.model.state} model={this.props.model} />;
            }
        }
        render() {
            return (
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {this.renderBody()}
                </div>
            );
        }
    }

    return observer(DataProvider);
}
