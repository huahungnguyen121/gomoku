import React from "react";
import "./index.css";

export default class Cell extends React.Component {
    render() {
        return (
            <button
                className={`cell${
                    this.props.highlight ? " cell--highlight" : ""
                }`}
                onClick={this.props.onClick}
            >
                {this.props.value.toUpperCase()}
            </button>
        );
    }
}
