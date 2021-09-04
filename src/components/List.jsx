import React from "react";
import SingleItem from "./SingleItem.jsx";

function List(props) {
    const data = props.itemList;
    const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: (props.curr ? props.curr : "CAD") });

    function sortArray(a, b) {
        if(a.important) {
            return -1; //sets A index less then B (A before B)
        } else {
            return 1;
        }
    }

    let preparedData = props.convertCosts(data);
    preparedData = preparedData.sort(sortArray);

    return <React.Fragment>
            <div className="col">
                {/* HEADERS */}
                <div className="col-headers">
                    <p className="header-title">Наименование</p>
                    <p className="summary">Total: {formatter.format(props.sum)}</p>
                </div>
                {/* TABLE */}
                <div className="col-items">
                    {preparedData.map( item => 
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