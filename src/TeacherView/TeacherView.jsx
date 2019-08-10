import React from "react";
import ThreeScene from "../ThreeScene/ThreeScene.jsx";
import MoleculaProperties from "../MoleculeProperties/MoleculeProperties.jsx";
import ButtonLight from "../ButtonLight/ButtonLight.jsx";
import FormulaScript from "../FormulaScript/FormulaScript.jsx";
import ResultScene from "../ResultScene/ResultScene.jsx";
import { dictionaryAtoms } from "../3d_model/DictionaryAtomProperties.js";
import OverlayScreen from "../OverlayScreen/OverlayScreen.jsx";
import SingleElementMendeleev, { EmptyElement } from "../SingleElementMendeleev/SingleElementMendeleev.jsx";
import "./TeacherView.scss";

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export default class TeacherView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formulaValue: '',
            molecules: [],
            showResult: false,
            showAddToDatabase: false
        }
        this.formulaValueChanged = this.formulaValueChanged.bind(this);
        this.chemicalElementClicked = this.chemicalElementClicked.bind(this);
        this.deleteLast = this.deleteLast.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.addMolecule = this.addMolecule.bind(this);
        this.clearReaction = this.clearReaction.bind(this);
        this.generateResult = this.generateResult.bind(this);
        this.resultScene = React.createRef();
        this.addToDatabase = this.addToDatabase.bind(this);
        this.cancelAdding = this.cancelAdding.bind(this);
    }
    formulaValueChanged(event) {
        this.setState({formulaValue: event.target.value});
    }
    chemicalElementClicked(event) {
        let formula = this.state.formulaValue + event;
        this.setState({formulaValue: formula});
    }
    deleteLast() {
        let formulaValue = this.state.formulaValue.split(/(?=[A-Z])/);
        formulaValue.pop();
        this.setState({formulaValue: formulaValue.join('')});
    }
    clearAll() {
        this.setState({formulaValue: ''})
    }
    addMolecule() {
        let moleculeArray = this.state.molecules;
        moleculeArray.push(this.state.formulaValue);
        this.setState({molecules: moleculeArray, formulaValue: ''});
    }
    clearReaction() {
        this.setState({molecules:[]})
        this.animateScroll();
    }
    animateScroll = () => {
        let offset = (document.body.scrollTop==0)?document.documentElement.scrollTop:document.body.scrollTop;
        document.body.scrollTop = document.documentElement.scrollTop = offset - 50;
        if(offset>0)
            setTimeout(this.animateScroll, 10);
    }
    generateResult() {
        this.setState({showResult: true});
    }
    addToDatabase() {
        this.setState({showAddToDatabase: true});
    }
    cancelAdding() {
        this.setState({showAddToDatabase: false});
    }
    render() {
        return (
            <>
                {this.state.showAddToDatabase && <OverlayScreen 
                            reactionName={this.resultScene.state.nameOfReaction}
                            components={this.state.molecules}
                            cancelAdding={this.cancelAdding}
                            result={this.resultScene.state.formula} />}
                <div id='controlButtons'>
                    <ButtonLight id='deleteLast' onClick={this.deleteLast}>Удалить</ButtonLight><br />
                    <ButtonLight id='clearAll' onClick={this.clearAll}>Очистить</ButtonLight>
                </div>
                <aside>
                    <div id='formulaHolder'>
                        <FormulaScript formula={this.state.formulaValue} />
                        <input type='text' value={this.state.formulaValue} onChange={this.formulaValueChanged} id='formulae' />
                    </div>
                    <ThreeScene formula={this.state.formulaValue} />
                    <MoleculaProperties formula={this.state.formulaValue} />
                    {this.state.formulaValue!="" && <ButtonLight onClick={this.addMolecule} id='addMolecule'>Добавить молекулу</ButtonLight> }
                </aside>
                <main>
                    {dictionaryAtoms.map((row, index)=> {
                        if(row==undefined) return;
                        return <div key={index}>
                        {row.map((atom, index) => {
                            if(isEmpty(atom))
                                return(<EmptyElement key={index} />);
                            return(
                                <SingleElementMendeleev
                                onElementSelected={this.chemicalElementClicked}
                                key={atom.letter}
                                elementNum={atom.num}
                                cyrillicName={atom.name}
                                elementMass={atom.mass}>
                                    {atom.letter}
                                </SingleElementMendeleev>
                            )})}
                        </div>
                    })}
                </main>
                <footer>
                    {this.state.molecules.length>0 && <><div id='reactiontext'>Реакция: </div><div style={{textAlign: 'center'}}><ButtonLight onClick={this.clearReaction}>Очистить</ButtonLight></div></>}
                    {this.state.molecules.map((atom)=>{
                        return <ThreeScene key={atom} formula={atom} />
                    })}
                    {this.state.molecules.length>0 && <div style={{textAlign: 'center'}}>
                    <ButtonLight onClick={this.generateResult}>Результат</ButtonLight>
                    {this.state.showResult && <>
                        <ResultScene 
                            ref={(resultScene)=>this.resultScene = resultScene}
                            molecules={this.state.molecules} />
                        <button onClick={this.addToDatabase} id='addToDatabase'>Добавить в базу</button>
                    </>}
                    </div>}
                </footer>
            </>
        )
    }
}