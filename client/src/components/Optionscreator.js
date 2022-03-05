import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export class Optionscreator extends Component {
    render() {
        return (
            <li className="list-group-item blackbg">
                <NavLink className="colorwhite" to={this.props.linkto} exact activeStyle={{ color: "red" }}>
                    <h1 >
                        <i className={this.props.classname} aria-hidden="true"></i>
                    </h1>
                    {this.props.field}
                </NavLink>
            </li>
        );
    }
}

export default Optionscreator;

