import React from "react";
import IconButton from '@material-ui/core/IconButton';
//import PublishIcon from '@material-ui/icons/Publish';
import AddIcon from '@material-ui/icons/Add';
//import UndoIcon from '@material-ui/icons/Undo';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


function InputLineGroup(props) {
    let text
    let price

    let inputFieldText;
    let inputFieldPrice;

    // console.log("Text field ", inputFieldText);
    // console.log("Price field ", inputFieldPrice);

    function resetInput(field) {
        field.value = "";
    }

    function onAddText() {
        inputFieldText = document.getElementById(`input-text-${props.array}`);
        inputFieldPrice = document.getElementById(`input-price-${props.array}`);

        text = inputFieldText.value;
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.price.${props.array}`).classList.toggle("active");
    }

    function onAddPrice() {
        price = inputFieldPrice.value;
        
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.price.${props.array}`).classList.toggle("active");
        
        props.onItemAdd(text, price, props.array);

        resetInput(inputFieldText);
        resetInput(inputFieldPrice);
    }

    function onBackToText() {
        price = document.getElementById(`input-price-${props.array}`).value;
        
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.price.${props.array}`).classList.toggle("active");
    }

    return <React.Fragment>
        <div className={`add-btn-group text ${props.array} active`}>
            <input type="text" id={`input-text-${props.array}`} placeholder="Add new line..." />
            <IconButton aria-label="addItem" onClick={onAddText}>
                <ArrowForwardIcon />
            </IconButton>
        </div>
        <div className={`add-btn-group price ${props.array}`}>
            <input type="text" id={`input-price-${props.array}`} placeholder="Add price..." />
            <IconButton aria-label="addItem" onClick={onBackToText}>
                <ArrowBackIcon  />
            </IconButton>
            <IconButton aria-label="addItem" onClick={onAddPrice}>
                <AddIcon />
            </IconButton>
        </div>
    </React.Fragment>
}

export default InputLineGroup;