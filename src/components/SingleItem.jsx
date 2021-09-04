import React, { useState } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

function SingleItem(props) {
    const [state, setState] = useState(false);
    const {item, onDelete, onHide, onSwap, onMark, curr} = props;

    const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: curr });

    //passing functions from App to handle icons back (with item )
    const handleBookmarking = () => onMark(item);
    const handleSwap = () => onSwap(item);
    const handleDelete = () => onDelete(item);
    const handleHiding = () => onHide(item);

    function showHideIcons(e, usedIcons) {
        const iconSet = e.target.parentNode;
        iconSet.querySelector(".item-buttons-additional").classList.toggle("open");

        setState(prevState => !prevState);
    }


    //24 - dollars, 20 - rubles
    return (
        <div className="col-item">
            <p className="item-field-1">{item.name}</p>
            <p className={"item-field-2 " + (item.visible ? "" : "crossed")}>
                {formatter.format(item.price)}
            </p>
            <div className="item-buttons">
                <IconButton aria-label="more" onClick={showHideIcons}>
                    { !state 
                        ? <UnfoldMoreIcon className="folding-icon" />
                        : <UnfoldLessIcon className="folding-icon" />
                    }
                </IconButton>
                <div className="item-buttons-additional">
                    <IconButton aria-label="swap" onClick={handleSwap}>
                        <SyncAltIcon />
                    </IconButton>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                color="default"
                                icon={<VisibilityOffOutlinedIcon />} 
                                checkedIcon={<VisibilityOutlinedIcon />}
                                checked={item.visible} 
                                onChange={handleHiding} 
                                name="visible" 
                            />
                        }
                    />
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteOutlineOutlinedIcon />
                    </IconButton>
                </div>
                <FormControlLabel
                    control={
                        <Checkbox 
                            icon={<NewReleasesOutlinedIcon />} 
                            checkedIcon={<NewReleasesIcon />}
                            checked={item.important} 
                            onChange={handleBookmarking} 
                            name="important" 
                        />
                    }
                />
            </div>
        </div>
        );
    }

export default SingleItem;