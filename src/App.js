import Container from '@material-ui/core/Container';
import React, { useState, useEffect } from 'react';
import List from "./components/List.jsx";
import TableHeading from "./components/TableHeading.jsx";
import InputLineGroup from "./components/InputLineGroup.jsx";
//import testData from "./testData.js";
import { nanoid } from 'nanoid';
import axios from 'axios';
//import Currency from "./components/Currency.jsx";


// const rates = Currency();
// console.log("rates", rates);
// const currency = await axios.get('http://data.fixer.io/api/latest?access_key=644fe21408c7556ea0360b75c9bb7d3c&symbols=CAD,RUB');
// console.log("RATES ", currency.data.base, currency.data.rates);

function App() {
  const [list, setList] = useState({});
  const [settings, setSettings] = useState({});

  const currency = {data: {base: "EUR", rates: {CAD: 1.506825, RUB: 88.607123}}};
  //console.log("RATES ", currency.data.base, currency.data.rates);
  console.log("List (state):  ", list);

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

  async function postData(newItem) {
    try {
      await axios.post({
        method: "post",
        url: "https://organizer-apps-api.herokuapp.com/expences",
        data: {"id":"mvQOyChAa6I02kmbkf0v2","name":"lasting integrity 2","price":"119","important":false,"list":"before","visible":true,"currency":"cad"}
      });

      // const res = await axios.post('https://organizer-apps-api.herokuapp.com/expence', {"id":"mvQOyChAa6I02kmbkf0v2","name":"lasting integrity 2","price":"119","important":false,"list":"before","visible":true,"currency":"cad"}
      //   );
            
    } catch (error) {
      console.error("API Post request error", error, newItem);
    }
  }

// ########################################################
  function onMove(passedItem) {
    const arrToDelType = passedItem.list === "before" ? "before" : "after";
    const arrToAddType = passedItem.list === "before" ? "after" : "before";
    
    setList( prevList => {
      const updatedItem = {...passedItem, list: passedItem.list === "before" ? "after" : "before"}
      const arrToDel = prevList[passedItem.list].filter( item => item.id !== passedItem.id);
      const arrToAdd = [...prevList[arrToAddType], updatedItem ]; //{ after: [] }

      return {[arrToDelType]: arrToDel, [arrToAddType]: arrToAdd};
    })
  }

// ########################################################
  function onDelete(passedItem) {
    
    function filterArray(array, itemToDel) {
      return array.filter( item => item.id !== itemToDel.id)
    }

    setList( prevData => {
        return { before: filterArray(prevData["before"], passedItem), 
                  after: filterArray(prevData["after"], passedItem) }
    })
  }

// ########################################################
  function onHide(passedItem) {
      const editedArray = passedItem.list === "before" ? "before" : "after";

      setList( prevList => {
        let updatedArray = prevList[passedItem.list].map( item => 
          item.id === passedItem.id ? {...item, visible: !item.visible} : item
        )
        
        return {...prevList, [editedArray]: updatedArray }
      });
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
  function onAdd(text, itemPrice, toList) {
    let newArrayItem = {id: nanoid(), name: text, price: itemPrice, important: false, list: toList, visible: true, currency: "cad"} 

   
    console.log("PRER JSON > ", JSON.stringify(newArrayItem));
    postData(newArrayItem);
    setList( prevList => {
      return {...prevList, [toList]: [...prevList[toList], newArrayItem]}
    })
  }


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

  console.log("Totals for headers", totals());



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
                  >
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