import Container from '@material-ui/core/Container';
import React, { useState, useEffect } from 'react';
import List from "./components/List.jsx";
import TableHeading from "./components/TableHeading.jsx";
import InputLineGroup from "./components/InputLineGroup.jsx";
import ListMessage from "./components/ListMessage.jsx";
//import testData from "./testData.js";

import axios from 'axios';


// const rates = Currency();
// console.log("rates", rates);
// const currency = await axios.get('http://data.fixer.io/api/latest?access_key=644fe21408c7556ea0360b75c9bb7d3c&symbols=CAD,RUB');
// console.log("RATES ", currency.data.base, currency.data.rates);


// const currency = "rub";

function App(props) {
  const [list, setList] = useState({});
  const [settings, setSettings] = useState({});

  let itemsCurrency = "cad";
  const currency = {base: "EUR", rates: {CAD: 1.5, RUB: 88.6}};
  //console.log("RATES ", currency.data.base, currency.data.rates);
  console.log("List (state):  ", list);

  // setList(props.data);
  // setSettings(props.settings);

  async function fetchData() {
    try {
      const expences = await axios.get('https://organizer-apps-api.herokuapp.com/expences');
      const settingsData = await axios.get('https://organizer-apps-api.herokuapp.com/settings');
      
      //fetching external API with rates here
        
      const beforeList = expences.data.filter( item => item.list === "before");
      const afterList = expences.data.filter(item => item.list === "after");
      
      setList({before: [...beforeList], after: [...afterList]});
      setSettings({budget: settingsData.data[0].budget});
    } catch (error) {
      console.error("API Request error", error);
    }
  }

	useEffect(() => {fetchData()}, []);


// #############################################################################################
// #############        AXIOS API CALLS    #####################################################
// #############################################################################################

// ############       POST        ##############################################################
// Using compound function to update local state and use axios to update BD on heroku
  async function onAdd(newItem) {
    //save new item to the State
    setList( prevList => {
      return {...prevList, [newItem.list]: [...prevList[newItem.list], newItem]}
    });

    const message = document.querySelector(".status-label");
    message.innerHTML = "Saving new item to DB..."
    message.classList.toggle("hidden");

    //activate "Saving label"
    try {
      await axios
        .post('https://organizer-apps-api.herokuapp.com/expences', newItem)
        .then(response => {
          //Update Saving lavel and hide it
          message.classList.toggle("success");
          message.innerHTML = "Saved..."
          setTimeout( () => message.classList.toggle("hidden"), 2000);
          message.classList.toggle("success");
        });

    } catch (error) {
        console.error("Axios Post error", error, newItem);
        //show error on Saving label and possibly "retry" button
        // 
        message.innerHTML = "Error, the line has not been saved...";
        message.classList.toggle("alert");
        // +++++++
        //add retry + dont leave alert class

        //    !!! Here may be the app should highlight input field to indicate that error was thrown and wait for retry
    }


  }

// ###########       DELETE        ##############################################################
// Using compound function to update local state and use axios to update BD on heroku
  async function onDelete(passedItem) {

    function filterArray(array, itemToDel) {
            return array.filter( item => item.id !== itemToDel.id)
          }
          
    setList( prevData => {
        return { before: filterArray(prevData["before"], passedItem), 
                  after: filterArray(prevData["after"], passedItem) }
    })

    const message = document.querySelector(".status-label");
    message.innerHTML = "Deleting line from DB..."
    message.classList.toggle("hidden");

    try {
      await axios
        .delete(`https://organizer-apps-api.herokuapp.com/expences/${passedItem.id}`)
        .then(response => {
          message.classList.toggle("success");
          message.innerHTML = "Deleted..."
          setTimeout( () => message.classList.toggle("hidden"), 2000);
          message.classList.toggle("success");
        });

    } catch (error) {
      console.error("Axios Del error", error, passedItem);
      message.innerHTML = "Error, the line has not been deleted...";
      message.classList.toggle("alert");
    }
  }

// ###########       UPDATE        ##############################################################
// Using this func directly as event handler will be to complex due to 2 events that require update
  async function updateData(item) {

    const message = document.querySelector(".status-label");
    message.innerHTML = "Updating item in DB..."
    message.classList.toggle("hidden");

    try {
      await axios
        .put(`https://organizer-apps-api.herokuapp.com/expences/${item.id}`, item)
        .then(response => {
          console.log("Axios update response: ", response);

          message.classList.toggle("success");
          message.innerHTML = "Updated..."
          setTimeout( () => message.classList.toggle("hidden"), 2000);
          message.classList.toggle("success");
        });

    } catch (error) {
        console.error("Axios Update error", error, item);

        message.innerHTML = "Error, the line has not been updated...";
        message.classList.toggle("alert");
    }
  }

// ################################################################################################
// ################################################################################################
  function onMove(passedItem) {
    const arrToDelType = passedItem.list === "before" ? "before" : "after";
    const arrToAddType = passedItem.list === "before" ? "after" : "before";
    const updatedItem = {...passedItem, list: passedItem.list === "before" ? "after" : "before"}

    setList( prevList => {
      const arrToDel = prevList[passedItem.list].filter( item => item.id !== passedItem.id);
      const arrToAdd = [...prevList[arrToAddType], updatedItem ]; //{ after: [] }

      return {[arrToDelType]: arrToDel, [arrToAddType]: arrToAdd};
    })

    //update 1 line of data
    updateData(updatedItem);

  }

// ########################################################
  function onHide(passedItem) {
    const updatedItem = {...passedItem, visible: !passedItem.visible}

      setList( prevList => {
        let updatedArray = prevList[passedItem.list].map( item => 
          item.id === passedItem.id 
            ? updatedItem 
            : item
        )
        
        return {...prevList, [passedItem.list]: updatedArray }
      });

      updateData(updatedItem)
  };

// ########################################################
  function onBookmark(passedItem) {
    const editedArray = passedItem.list === "before" ? "before" : "after";

    setList( prevList => {
        let updatedArray = prevList[passedItem.list].map( item => 
          item.id === passedItem.id ? {...item, important: !item.important}: item
        )
        
        return {...prevList, [editedArray]: updatedArray }
    });      
  }

// ########################################################
  // function onAdd(text, itemPrice, toList) {
  //   let newArrayItem = {id: nanoid(), name: text, price: itemPrice, important: false, list: toList, visible: true, currency: "cad"} 

  //   postData(newArrayItem);
  // }


  function sumItems(array) {
    return list[array].filter(item => item.visible === true).reduce( (sum, item) => sum + item.price, 0)
  }

  const totals = () => {
    const totalBefore = list.length > 0 ? sumItems("before") : null;
    const totalAfter = list.length > 0 ? sumItems("after") : null;
    const budget = settings.budget;
    const total = budget - (totalBefore + totalAfter);
    return {totalBefore: totalBefore, totalAfter: totalAfter, budget: budget, total: total}
  }

  function switchCurrency(baseCurrency) {

    // const usedCurrency = baseCurrency
    //   ? baseCurrency
    //   : itemsCurrency === "cad" 
    //     ? "rub" 
    //     : "cad";
        
    itemsCurrency = itemsCurrency === "cad" ? "rub" : "cad";

    //recalc all list
    function convertCosts(item) {
      console.log("Old item: ", item.name, item.price, item.currency)
      // const ratesRub = currency.rates.RUB;
      // const ratesCad = currency.rates.CAD;
      const rateCadRub =  currency.rates.RUB / currency.rates.CAD;
      // console.group('RATES TESTS');
      //   console.log("ratesRub: ", ratesRub);
      //   console.log("ratesRub type: ", typeof(ratesRub));
      //   console.log("ratesCad: ", ratesCad);
      //   console.log("ratesCad type: ", typeof(ratesCad));
      //   console.log("rateCadRub: ", rateCadRub);
      //   console.log("rateCadRub type: ", typeof(rateCadRub));
      // console.groupEnd();
      if(item.currency === "cad") {
        return {...item, price: (item.price * rateCadRub), currency: "rub"};
      } else if(item.currency === "rub") {  
        return {...item, price: (item.price / rateCadRub), currency: "cad"};
      } else {
        console.log("switchCurrency - convertCosts: Error - unknown currency of the item:", item);
      }
    }

    function recalcArray(array) {
      const tempArray = array.map(item => item.currency === "itemsCurrency" ? item : convertCosts(item))
      console.log("TEMP ARRAY CONVERTED  >> ", tempArray);
    }

    setList( prevList => {
      return {before: recalcArray(list.before), after: recalcArray(list.after)}
    })
  }


  //console.log("RATE (55,3)", rateCadRub);

  return (
    <Container fixed>
      <div className="content-wrapper">
        <TableHeading budget={settings.budget} data={list} onCountTotal={sumItems}>
        </TableHeading>
        <div className="content">
          <div className="section first">
            <h2>Before moving</h2>
            <div className="wrapper">
              {!list.before 
                ? <p>Loading...</p>
                : <List 
                  itemList={list["before"]} 
                  onMoveItem={onMove} 
                  onDeleteItem={onDelete}
                  onHideItem={onHide}
                  onBookItem={onBookmark}
                  curr={itemsCurrency}
                  onSwitch={switchCurrency}
                  >
                    <ListMessage />
                    <InputLineGroup array="before" onItemAdd={onAdd} />
                  </List>
              }
            </div>
          </div>
          <div className="section">
            <h2>After moving</h2>
            <div className="wrapper">
              {!list.before 
                ? <p>Loading...</p>
                : <List 
                  itemList={list["after"]} 
                  sum={sumItems("after")}
                  onMoveItem={onMove} 
                  onDeleteItem={onDelete}
                  onHideItem={onHide}
                  onBookItem={onBookmark}
                  curr={itemsCurrency}
                  onSwitch={switchCurrency}
                  >
                    <InputLineGroup array="after" onItemAdd={onAdd} />
                </List>
              }
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default App;