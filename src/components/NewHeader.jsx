import React from "react";

import TuneIcon from '@material-ui/icons/Tune';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function NewHeader() {



    return <React.Fragment>
        <section className="header flex justify-around h-12 items-center bg-red-200">
            <AccountCircleIcon />
            <PlaylistAddIcon />
            <AttachMoneyIcon />
            <TuneIcon />
        </section>

    </React.Fragment>
}