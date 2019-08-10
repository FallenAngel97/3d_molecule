import React from "react";
import "./SingleElementMendeleev.scss";

export default class SingleElementMendeleev extends React.Component {
    constructor(props) {
        super(props);
        this.onElementClick = this.onElementClick.bind(this);
    }
    onElementClick(event) {
        this.props.onElementSelected(this.props.children);
    }
    render() {
        return (
            <div onClick={this.onElementClick} className='singleElementMendeleev'>
                <span className='elementNum'>{this.props.elementNum}</span>
                <span className='elementMass'>{this.props.elementMass}</span>
                <span className='elementLetter'>{this.props.children}</span>
                <span className='cyrillicName'>{this.props.cyrillicName}</span>
            </div>
        )
    }
}

export class EmptyElement extends React.PureComponent {
    render() {
        return(<div className="emptyElement" />)
    }
}