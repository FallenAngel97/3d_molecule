import React from "react";
import ThreeScene from "../ThreeScene/ThreeScene.jsx";
import "./StudentView.scss";

export default class StudentView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formulas: []
        }
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/getFormulas", true);
        xhr.onreadystatechange = () => {
            if(xhr.status == 200 && xhr.readyState == 4) {
                this.setState({formulas: JSON.parse(xhr.responseText)})
            }
        }
        xhr.send();
        this.deleteReaction = this.deleteReaction.bind(this);
    }
    deleteReaction(formulaId) {
        console.log(formulaId);
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/deleteFormula?formulaId="+formulaId, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
            if(xhr.status == 200 && xhr.readyState == 4) {
                this.setState({formulas: JSON.parse(xhr.responseText)})
            }
        }
        xhr.send();
    }
    render() {
        return(
            <>
                <main>
                    {this.state.formulas.length>0 && this.state.formulas.map((formula)=>(
                        <div className="moleculeHolder" key={formula.reactionName}>
                            <div className="reactionName">{formula.reactionName}</div>
                            {JSON.parse(formula.components).map((molecule)=>(
                                <ThreeScene key={molecule} formula={molecule} />
                            ))}
                            <div className='sign'>=</div>
                            <ThreeScene formula={formula.resultMolecule} />
                            <br />
                            <div onClick={() => this.deleteReaction(formula.id)} className='deleteReaction'>Удалить реакцию <span>X</span></div>
                        </div>
                    ))}
                    {this.state.formulas.length == 0 && <div>Нет формул</div>} 
                </main>
            </>
        )
    }
}