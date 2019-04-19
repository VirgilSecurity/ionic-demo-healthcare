import React from "react";
import { FaUserClock } from "react-icons/fa";

interface IConditionalText {
    content: React.ReactNode;
    isReady: any;
    title?: string;
}

export const ConditionalText: React.FC<IConditionalText> = props => {
    const body = (
        <>
            <FaUserClock size="2em" />{" "}
            <span style={{ verticalAlign: "bottom" }}>{props.content}</span>
        </>
    );
    const content = props.isReady ? <>{props.children}</> : body;
    return (
        <div>
            <b>{props.title}</b>
            <br />
            {content}
        </div>
    );
};
