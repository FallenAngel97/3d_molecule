import React from "react";

export default class FormulaScript extends React.Component {
    getNeededFormula(elements) {
        let elementString = "";
        let letterCount = 1;
        let rememberedLetter = '';
        for(let i=0;i<elements.length;i++){
            if(elements[i]==rememberedLetter) {
                letterCount++;
                if(i==elements.length-1)
                    elementString+=letterCount;
            } else {
                elementString+=(letterCount!=1?letterCount:'') + elements[i];
                rememberedLetter = elements[i];
                letterCount = 1;
            }
        }
        elements = (elementString.split(/(?=[A-Z][0-9]?)/))
        elementString = "<mrow>";
        elements.map((elem)=> {
            if(elem.length==2 && /\d/.test(elem)){
                elementString+="<msub><mi>"+elem[0]+"</mi><mn>"+elem[1]+"</mn></msub>"
            } else {
                elementString+="<mi>"+elem+"</mi>";
            }
        });
        elementString+="</mrow>";
        return elementString;
    }
    render() {
        return this.props.formula.length>0 && 
            <math dangerouslySetInnerHTML={{__html: this.getNeededFormula(this.props.formula.split(/(?=[A-Z])/))}} />
        
    }
}