import React from "react";
import { calculateMass } from "../3d_model/DictionaryAtomProperties";
import "./MoleculeProperties.scss";

export default class MoleculaProperties extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            molarMass: '0',
            mass: '0'
        }
    }
    componentWillReceiveProps(nextProps) {
        let chemicalElements = nextProps.formula.split(/(?=[A-Z])/);
        if (chemicalElements.length==1 && chemicalElements[0].length == 0) return;
        const avogadro = 6.0221408577474; // * 10^23
        this.setState({ molarMass: calculateMass(chemicalElements), mass:(calculateMass(chemicalElements)/avogadro).toFixed(3)});
    }
    render() {
        return(
          this.props.formula.length>0 && 
          <div id='moleculeProperties'>
              Молекулярная масса {this.state.molarMass} г/моль <br />
              Масса {this.state.mass}*10^-23 г
          </div>
        )
    }
}