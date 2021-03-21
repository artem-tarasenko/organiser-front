import React from "react";
import { nanoid } from 'nanoid';
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

    function resetInput(event) {
        if(event.target) {
            document.getElementById(`input-text-${event.target.classList[1]}`).value = "";
            document.getElementById(`input-price-${event.target.classList[1]}`).value = "";     
        } else {
            inputFieldText.value = "";
            inputFieldPrice.value = "";
        }
        
        // document.getElementById(`input-text-${event.target.className}`).value = "";
        // document.getElementById(`input-price-${event.target.className}`).value = "";

        //maybe should set 2 variables right on change
        //then check here if var != 0 then set its value

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

        let newArrayItem = {id: nanoid(), name: text, price: price, important: false, list: props.array, visible: true, currency: "cad"} 
        
        props.onItemAdd(newArrayItem);

        resetInput(inputFieldText);
        resetInput(inputFieldPrice);
    }

    function onBackToText() {
        price = document.getElementById(`input-price-${props.array}`).value;
        
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.price.${props.array}`).classList.toggle("active");
    }

    function handleEnter(e) {
        if(e.target.type === "text" && e.keyCode === 13) {
            onAddText();
            document.getElementById(`input-price-${e.target.className}`).focus();
        } else if(e.target.type === "number" && e.keyCode === 13) {
            onAddPrice();
        }
    }

    return <React.Fragment>
        <div className={`add-btn-group text ${props.array} active`}>
            <div className="input-group">
                <input type="text" id={`input-text-${props.array}`} className={props.array} placeholder="Add new line..." onKeyDown={handleEnter} tabIndex="-1" />
                <button className={`reset-${props.array} ${props.array}`} onClick={resetInput}>X</button>
            </div>

            
            <IconButton aria-label="addItem" onClick={onAddText} >
                <ArrowForwardIcon />
            </IconButton>
        </div>
        <div className={`add-btn-group price ${props.array}`}>
            <div className="input-group">
                <input type="number" id={`input-price-${props.array}`} className={props.array} placeholder="Add price..." onKeyDown={handleEnter} tabIndex="1" />
                <button className={`reset-${props.array} ${props.array}`} onClick={resetInput}>X</button>
            </div>
            <IconButton aria-label="addItem" onClick={onBackToText} >
                <ArrowBackIcon  />
            </IconButton>
            <IconButton aria-label="addItem" onClick={onAddPrice} >
                <AddIcon />
            </IconButton>
        </div>
    </React.Fragment>
}

export default InputLineGroup;