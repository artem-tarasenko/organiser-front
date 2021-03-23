import React from "react";
import SingleItem from "./SingleItem.jsx";
// import IconButton from '@material-ui/core/IconButton';
// import AddBoxIcon from '@material-ui/icons/AddBox';
// import PublishIcon from '@material-ui/icons/Publish';

function List(props) {
    const data = props.itemList;

    function sortArray(a, b) {
        if(a.important) {
            return -1; //sets A index less then B (A before B)
        } else {
            return 1;
        }
    }

    
    return <React.Fragment>
            <div className="col">
                {/* HEADERS */}
                <div className="col-headers">
                    <p className="header-title">Наименование</p>
                    <p className="summary">Total: {props.sum}</p>
                    <p className="currency-button">
                        {props.curr === "cad" 
                            ? <button className="currency-switch" onClick={props.onSwitch} >CAD</button> 
                            : <button className="currency-switch" onClick={props.onSwitch} >RUR</button>
                        }
                    </p>
                </div>
                {/* TABLE */}
                <div className="col-items">
                    {data.sort(sortArray).map( item => 
                        <SingleItem 
                            key={item.id} 
                            item={item} 
                            onDelete={props.onDeleteItem} 
                            onHide={props.onHideItem} 
                            onSwap={props.onMoveItem} 
                            onMark={props.onBookItem} 
                            curr={props.curr}
                        />
                        )}
                </div>
                {/* INPUTS */}
                {props.children}
            </div>
            </React.Fragment>
}


export default List;