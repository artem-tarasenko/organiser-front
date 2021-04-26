import Container from '@material-ui/core/Container';
import React, { useState, useEffect } from 'react';
import List from "./components/List.jsx";
import TableHeading from "./components/TableHeading.jsx";
import InputLineGroup from "./components/InputLineGroup.jsx";
import ListMessage from "./components/ListMessage.jsx";
import axios from 'axios';
import "./index.css";


// const rates = Currency();
// console.log("rates", rates);



// const currency = "rub";

function App(props) {
  const [list, setList] = useState({});
  const [settings, setSettings] = useState({});
  const [sum, setSum] = useState({before: 0, after: 0})

  
  const currency = {base: "EUR", rates: {CAD: 1.48, RUB: 91.1}};
  // let currency;
  // console.log("RATES ", currency);
  // sum && console.log("List (state):  ", list);
  // sum && console.log("Settings", settings);
  // sum && console.log("Summary", sum);

  const rateCadRub = currency.rates.RUB / currency.rates.CAD;
  //console.log("PARSED RATES: ", currency, rateCadRub);

  function convertCosts(arr, curr) {

    // console.group('Converting list...');
    // console.log("Array passed: ", arr);
    // console.log("Settings curr: ", settings.appCurrency);
    // console.groupEnd();

    let newArr = arr.map(item => {
      //console.group('#################   CONVERTING ARRAY ###############################');
      //console.log("Testing item (name, curr) > ", item.name, "#", item.currency);
      //console.log("COMPARE CURRENCY BEFORE CONVERTING: item - settings: ", item.currency, "Default: ", curr)
      if(item.currency !== settings.appCurrency) {
        //console.log("Item will be converted (name, curr) > ", item.name, "#", item.currency);
        //convert price and update currency
        if(item.currency === "cad") {
          //console.log("Converting from CAD to RUB >", item.name, "#", item.currency);
          //console.groupEnd();
          //Result * 10, round it to a number and them /10 to get 1 decimal num
          return {...item, price: ((Math.round((item.price * rateCadRub) * 100) / 100)), currency: "rub"};
        } else if(item.currency === "rub") {
          //console.log("Converting from RUB to CAD >", item.name, "#", item.currency);
          //console.groupEnd();
          return {...item, price: ((Math.round((item.price / rateCadRub) * 100) / 100)), currency: "cad"};
        }
      } else {
        //save existing object
        //console.log("Item currency match, returning as is (name, cur)", item.name, "#", item.currency)
        //console.groupEnd();
        return item;
      }
    })
    //console.log("CONVERTING - resulting array to return", newArr);
    // console.groupEnd();
    return newArr;
  }

  async function fetchData() {
    try {
      const expences = await axios.get('https://organizer-apps-api.herokuapp.com/expences');
      const settingsData = await axios.get('https://organizer-apps-api.herokuapp.com/settings');
      
      //fetching external API with rates here
      // const apiRatesResult = await axios.get('http://data.fixer.io/api/latest?access_key=644fe21408c7556ea0360b75c9bb7d3c&symbols=CAD,RUB');
      // currency = apiRatesResult.data.rates;
      // console.log("API RATES ", currency);
      // const callDate = new Date(Date.now()).toISOString().split("T")[0]; //Array ["YYYY-MM-DD", "HH:MM:SS..."]
      // console.log("DATE: ", callDate)



      setSettings({budget: settingsData.data[0].budget, appCurrency: "rub", budgetCurrency: "cad"});
        
      const beforeList = expences.data.filter( item => item.list === "before");
      const afterList = expences.data.filter(item => item.list === "after");
      const defaultCurrency = "rub"

      let convertedBeforeList = convertCosts(beforeList, defaultCurrency);
      let convertedAfterList = convertCosts(afterList, defaultCurrency)

      //console.log("Fetch - convnvert at start arrays: ", convertedBeforeList, convertedAfterList);

      setList({before: [...convertedBeforeList], after: [...convertedAfterList]});

      //console.log("SETTING SUMS Before (init array, sum): ", convertedBeforeList, sumItems(convertedBeforeList));
      //console.log("SETTING SUMS After (init array, sum): ", convertedAfterList, sumItems(convertedAfterList));
      setSum({before: sumItems(convertedBeforeList), after: sumItems(convertedAfterList)})

    } catch (error) {
      console.error("API Request error", error);
    }
  }

	useEffect(() => {fetchData()}, []);
  useEffect(() => setSum({before: sumItems(list.before), after: sumItems(list.after)}), [list])


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
          //console.log("Axios update response: ", response);

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
    const updatedItem = {...passedItem, 
                            price: passedItem.price, 
                            currency: passedItem.currency, 
                            list: passedItem.list === "before" ? "after" : "before"
                        }
    // console.log("Updated item to post", updatedItem)
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
  function switchCurrency() {
    // console.log("Before switch", settings.appCurrency);
    setSettings(prevValue => settings.appCurrency === "cad" 
      ? {...prevValue, appCurrency: "rub"} 
      : {...prevValue, appCurrency: "cad"} 
    );

    // console.log("After switch", settings.appCurrency);
    let convertedBeforeList = convertCosts(list.before);
    let convertedAfterList = convertCosts(list.after);
    setList({before: [...convertedBeforeList], after: [...convertedAfterList]});
  }

  function sumItems(array) {
    
    if(array) {
      let convertedArray = convertCosts(array);
      //console.log("SUMMARY - Converted array to process", convertedArray);
      const temp = convertedArray.filter(item => item.visible === true);
      // console.log("TEMP ARRAY FILTERED", temp);
      const temp2 = temp.reduce( (accum, item) => accum + item.price, 0)
      // console.log("TEMP REDUCED", temp2);
      // console.group('SUMMARY');
      // console.log("Converted array to process", convertedArray);
      // console.log("Visible items", temp);
      // console.log("Reduces", temp2);
      // console.log("Testing array curr", convertedArray[0].curency);
      // console.log("Compare with default curr", settings.appCurrency);
      // console.groupEnd();
      if(convertedArray[0].currency !== settings.appCurrency) {
        if(convertedArray[0].currency === "cad") {
          let temp3 = ((Math.round((temp2 * rateCadRub) * 100) / 100));
          return temp3;
        } else {
          let temp3 = ((Math.round((temp2 / rateCadRub) * 100) / 100));
          return temp3;
        }
      } else {
        return temp2;
      }

    } else {
      // console.log("Array seems like not ready: ", array)
    }
    
  }



  return (
    <Container fixed>
      <div className="content-wrapper flex-col p-0 m-0">
        <TableHeading settings={settings} sum={sum} rate={rateCadRub} onSwitch={switchCurrency} />
        
        <div className="content flex-col sm:flex-row">
          <div className="section first">
            <h2>Before moving</h2>
            <div className="wrapper">
              {!list.before 
                ? <p>Loading...</p>
                : <List 
                  itemList={list["before"]} 
                  sum={sum.before}
                  settings={settings}
                  onMoveItem={onMove} 
                  onDeleteItem={onDelete}
                  onHideItem={onHide}
                  onBookItem={onBookmark}
                  curr={settings.appCurrency}
                  convertCosts={convertCosts}
                  >
                      <InputLineGroup array="before" 
                                      onItemAdd={onAdd} 
                                      settings={settings} 
                                      exRate={rateCadRub} />
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
                  sum={sum.after}
                  settings={settings}
                  onMoveItem={onMove} 
                  onDeleteItem={onDelete}
                  onHideItem={onHide}
                  onBookItem={onBookmark}
                  curr={settings.appCurrency}
                  convertCosts={convertCosts}
                  >
                    <InputLineGroup array="after" onItemAdd={onAdd} settings={settings} exRate={rateCadRub} />
                </List>
              }
            </div>
          </div>
        </div>
      <ListMessage />
      </div>
    </Container>
  );
}

export default App;