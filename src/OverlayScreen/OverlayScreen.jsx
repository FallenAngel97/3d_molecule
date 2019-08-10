import React from "react";
import "./OverlayScreen.scss";
import ThreeScene from "../ThreeScene/ThreeScene.jsx";

export default class OverlayScreen extends React.Component {
    constructor(props) {
        super(props);
        this.cancelAdding = this.cancelAdding.bind(this);
        this.addToDBConfirm = this.addToDBConfirm.bind(this);
    }
    cancelAdding() {
        this.props.cancelAdding();
    }
    addToDBConfirm() {
        this.props.cancelAdding();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/addToDb", true); 
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send("array="+JSON.stringify(this.props.components)+"&result="+this.props.result+"&reactionName="+this.props.reactionName);
    }
    render() {
        return(<div id='overlayScreen'>
            <div id='holderFormulaFinal'>
                {this.props.components.map(t => <ThreeScene cameraZoom={2.5} size={150} formula={t}/>).reduce((prev, curr) => [prev, ' + ', curr])}
                =
                <ThreeScene cameraZoom={3} size={150} formula={this.props.result} />
                <br />
                {this.props.reactionName}
                <br />
                <span>Правильно?</span>
                <br />
                <button onClick={this.addToDBConfirm} id='confirm'>Да</button>
                <button onClick={this.cancelAdding} id='cancel'>Нет</button>
            </div>
        </div>);
    }
}