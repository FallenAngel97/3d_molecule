import React from "react";
import ReactDOM from "react-dom";
import TeacherStudentSelector from "./TeacherStudentSelector/TeacherStudentSelector.jsx";
import "./index.scss";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import TeacherView from "./TeacherView/TeacherView.jsx";
import StudentView from "./StudentView/StudentView.jsx";

class App extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            teacherSelected: !(window.location.href.indexOf("student")>-1),
        }
        this.linkClicked = this.linkClicked.bind(this);
    }

    linkClicked(e) {
        if(e.currentTarget.href.indexOf('student')>-1) {
            this.setState({teacherSelected: false});
        } else {
            this.setState({teacherSelected: true})
        }
    }

    render() {
        return(
            <Router>
                <div>
                    <Link onClick={this.linkClicked} to="/">
                        <TeacherStudentSelector isNavSelected={this.state.teacherSelected}>Учитель</TeacherStudentSelector>
                    </Link>
                    <Link onClick={this.linkClicked} to="/student">
                        <TeacherStudentSelector isNavSelected={!this.state.teacherSelected}>Ученик</TeacherStudentSelector>
                    </Link>
                    <Route path="/" exact component={TeacherView} />
                    <Route path="/student" component={StudentView} />
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

module.hot.accept();
