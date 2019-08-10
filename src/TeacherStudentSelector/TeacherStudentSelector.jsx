import React from "react";
import "./TeacherStudentSelector.scss";

export default class TeacherStudentSelector extends React.PureComponent {
    render() {
        return (
            <h3 className={"teacherStudentSelector " + (this.props.isNavSelected ? 'selected_nav' : '')}>
                {this.props.children}
            </h3>
        )
    }
}