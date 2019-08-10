import React from "react";
import "./ButtonLight.scss";

export default (props) => (
  <button onClick={props.onClick} className='buttonLight' id={props.id}>
    {props.children}
  </button>
) 