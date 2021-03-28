import React from "react";
import { nanoid } from 'nanoid';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';


function InputLineGroup(props) {
    const { settings: { budget, appCurrency } } = props;
    let text
    let price

    let inputFieldText;
    let inputFieldPrice;
    let addItemCurrency = null;

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

    function onAddName() {
        inputFieldText = document.getElementById(`input-text-${props.array}`);

        text = inputFieldText.value;
        //should be removing active
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        //and adding active class to the next-step-field, which is now buttons
        document.querySelector(`.add-btn-group.currency.${props.array}`).classList.toggle("active");
    }

    function onAddPrice() {
        inputFieldPrice = document.getElementById(`input-price-${props.array}`);
        price = inputFieldPrice.value;
        
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.price.${props.array}`).classList.toggle("active");

        let newArrayItem = {id: nanoid(), 
                            name: text, 
                            price: ((Math.round(price * 100)) / 100), 
                            important: false, 
                            list: props.array, 
                            visible: true, 
                            currency: addItemCurrency ? addItemCurrency : appCurrency} 
        
        if(addItemCurrency) {
            //here need to add checking of curr and if different -convert
            // console.log("Checking currencies (new, def): ", addItemCurrency, appCurrency)
            if(addItemCurrency !== appCurrency) {
                if(addItemCurrency === "cad") {
                    // console.log("New item curr - cad, price before convert:", newArrayItem.price); 
                    newArrayItem = {...newArrayItem, 
                                        price: ((Math.round((newArrayItem.price * props.exRate) * 100)) / 100), 
                                        currency: "rub"
                                    }
                } else if(addItemCurrency === "rub") {
                    // console.log("New item curr - rub, price before convert:", newArrayItem);
                    newArrayItem = {...newArrayItem, 
                                        price: ((Math.round((newArrayItem.price / props.exRate) * 100)) / 100), 
                                        currency: "cad"
                                    }
                }
                // console.log("New item price converted, new values (price, curr, item): ", newArrayItem.price, newArrayItem.currency, newArrayItem)
                props.onItemAdd(newArrayItem);
                resetInput(inputFieldText);
                resetInput(inputFieldPrice);
            } else {
                // console.log("Currency matches, no converting... (new, def): ", addItemCurrency, appCurrency)
                props.onItemAdd(newArrayItem);
                resetInput(inputFieldText);
                resetInput(inputFieldPrice);
            }
        } else {
            console.log("PICK CURRENCY");
            //make alert 
        }
    }

    function onBackToText() {
        changeInputStep("text", "currency")
    }

    function onBackToCurrency() {
        price = document.getElementById(`input-price-${props.array}`).value;
        changeInputStep("price", "currency")
    }

    function onResetInput() {
        inputFieldPrice = document.getElementById(`input-price-${props.array}`);
        document.querySelector(`.add-btn-group.text.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.price.${props.array}`).classList.toggle("active");

        //reset Selected class for foth buttons
        const buttons = [...document.querySelectorAll(".new-line-currency")];
        buttons.forEach(item => item.classList.remove("selected"));
        
        resetInput(inputFieldText);
        resetInput(inputFieldPrice);
    }

    function handleEnter(e) {
        if(e.target.type === "text" && e.keyCode === 13) {
            onAddName();
            document.getElementById(`input-price-${e.target.className}`).focus();
        } else if(e.target.type === "number" && e.keyCode === 13) {
            onAddPrice();
        }
    }

    function newItemCurrency(e) {
        //build string of classes for buttons in only 1 list
        const classes = ".new-line-currency." + e.target.classList[1];
        //get buttons to array
        const buttons = [...document.querySelectorAll(classes)];
        //reset Selected class for foth buttons
        buttons.forEach(item => item.classList.remove("selected"));
        //add class to a pressed button
        const activeCurrency = e.target.classList.toggle("selected");
        //now wait a spell and proceed to a third step - deactivate 2 block and activate 3 block
        changeInputStep("currency", "price")
        //Currency for a new item
        addItemCurrency = e.target.value;
        //console.log("selected currency", addItemCurrency);
    }

    function changeInputStep(from, to) {
        document.querySelector(`.add-btn-group.${from}.${props.array}`).classList.toggle("active");
        document.querySelector(`.add-btn-group.${to}.${props.array}`).classList.toggle("active");
    }

    return <React.Fragment>
        {/* INPUT NAME */}
        <div className={`add-btn-group text ${props.array} active`}>
            <div className="input-group">
                <input type="text" id={`input-text-${props.array}`} className={props.array} placeholder="Add new line..." onKeyDown={handleEnter} tabIndex="-1" />
                <button className={`reset-${props.array} ${props.array}`} onClick={resetInput}>X</button>
            </div>
            <IconButton aria-label="addItem" onClick={onAddName} >
                <ArrowForwardIcon />
            </IconButton>
        </div>

        {/* SELEC CURRENCY */}
        <div className={`add-btn-group currency-btns currency ${props.array}`}>
            <IconButton aria-label="addItem" onClick={onBackToText} >
                <ArrowBackIcon  />
            </IconButton>
            <button className={`new-line-currency ${props.array}`} onClick={newItemCurrency} value="cad">CAD</button>
            <button className={`new-line-currency ${props.array}`} onClick={newItemCurrency} value="rub">RUB</button>
        </div>

        {/* INPUT PRICE */}
        <div className={`add-btn-group price ${props.array}`}>
            <IconButton aria-label="addItem" onClick={onResetInput} >
                <RotateLeftIcon />
            </IconButton>
            <IconButton aria-label="addItem" onClick={onBackToCurrency} >
                <ArrowBackIcon  />
            </IconButton>
            <div className="input-group">
                <input type="number" id={`input-price-${props.array}`} className={props.array} placeholder="Add price..." onKeyDown={handleEnter} tabIndex="1" />
                <button className={`reset-${props.array} ${props.array}`} onClick={resetInput}>X</button>
            </div>
            <IconButton aria-label="addItem" onClick={onAddPrice} >
                <AddIcon />
            </IconButton>
        </div>
    </React.Fragment>
}

export default InputLineGroup;