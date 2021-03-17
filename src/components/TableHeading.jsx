import React, { useState } from "react";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';




function TableHeading(props) {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    return <div className="heading">
                <div className="heading-title">
                    <h1>TItle here</h1>
                    
                    {/* <div className="money flex-row">
                        <input type="text" /> 
                        <label>$</label>
                        <input type="button" value="change" />
                        <input type="text" />
                        <label>P</label>
                    </div> */}
                    <div className="heading-totals">
                        {/* <h2>Budget: {budget}</h2>
                        <h2>Before: {totalBefore}</h2>
                        <h2>After: {totalAfter}</h2>
                        <h2>Total: {total}</h2> */}
                    </div>
                </div>
                <div>
                    <IconButton aria-label="addItem" onClick={handleOpen}>
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
                                
                            </div>
                        </Fade>
                    </Modal>
                </div>
            </div>
}

export default TableHeading;