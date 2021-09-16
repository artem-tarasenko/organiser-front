import React, {useState} from "react";
import styles from "./NewHeader.module.scss";

import TuneIcon from '@material-ui/icons/Tune';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EuroIcon from '@material-ui/icons/Euro';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';




export default function NewHeader() {


    return <React.Fragment>
        <section className="header flex justify-around h-12 items-center bg-red-200">
            <AccountCircleIcon />
            <PlaylistAddIcon />
            <CurrencySelector />
            <TuneIcon />
        </section>

    </React.Fragment>
}

function CurrencySelector() {
    const [age, setAge] = useState('RUB');

    function handleChange(e) {
        setAge(e.target.value);
    };

    return <>
        <FormControl classes={styles.currency}>
            <Select
                inputProps={{ 'aria-label': 'Without label' }}
                id="currency"
                value={age}
                onChange={handleChange}
                label="Age"
            >
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"RUB"}>RUB</MenuItem>
                <MenuItem value={"CAD"}>CAD</MenuItem>
            </Select>
        </FormControl>
    </>
}