import React, { useState } from "react";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Switch from '@material-ui/core/Switch';
// import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RepeatIcon from '@material-ui/icons/Repeat';




function TableHeading(props) {
    const [open, setOpen] = useState(false); //false - RUB, true - CAD
    const { settings, sum, rate } = props;

    const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: (settings.appCurrency ? settings.appCurrency : "CAD") });
    
    //updating state
    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    const budgetResult = normalizedBudget() - (sum.before + sum.after);

    function normalizedBudget() {
        if(settings.appCurrency !== settings.budgetCurrency) {
            return settings.budgetCurrency === "rub" 
                ? (Math.round((settings.budget / rate) * 100)) /100
                : (Math.round((settings.budget * rate) * 100)) /100
        } else {
            return settings.budget
        }
    }

    function toggleCurrencySwitch(e) {
        props.onSwitch();
    }

    // console.group('HEADING');
    // console.log("Sum", sum);
    // console.log("Settings cuurency", settings.appCurrency);
    // console.log("Rate", rate);
    // console.log("Normalize()", normalizedBudget());
    // console.log("Budget result", budgetResult);
    // console.groupEnd();


    return <div className="heading">
                <div className="heading-title">
                    <h1>Expences planner</h1>
                    <IconButton aria-label="addItem" onClick={handleOpen} className="heading-button">
                        <SettingsIcon />
                    </IconButton>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <div className="settings-modal">
                                <h2 id="transition-modal-title">Settings</h2>
                                <div className="money flex-row">
                                    <input type="text" /> 
                                    <label>$</label>
                                    <input type="button" value="change" />
                                    <input type="text" />
                                    <label>P</label>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </div>
                <div className="heading-totals">
                    <p className="totals budget">
                        Budget: <span>{formatter.format(normalizedBudget())}</span>
                    </p>
                    <p className="totals sum">
                        Before: <span>{formatter.format(sum.before)}</span>
                    </p>
                    <p className="totals sum">
                        After: <span>{formatter.format(sum.after)}</span>
                    </p>
                    <p className={"totals sum-result " + (budgetResult >= 0 ? "" : "excel")}>
                        Total: <span>{formatter.format(budgetResult)}</span>
                    </p>
                    <div className="currency-change" >
                        <button className={"currency-button " + (settings.appCurrency === "cad" ? "active" : "")} onClick={props.onSwitch} >CAD</button> 
                        <FormControlLabel value="bottom" className="currency-switch" label="" labelPlacement="top" control={
                            <Switch color="primary" color="default" 
                                onChange={toggleCurrencySwitch}
                                checked={settings.appCurrency === "cad" ? false : true}
                            />
                        }/>
                        <button className={"currency-button " + (settings.appCurrency === "rub" ? "active" : "")} onClick={props.onSwitch} >RUR</button>
                    </div>
                </div>    
            </div>
}

export default TableHeading;