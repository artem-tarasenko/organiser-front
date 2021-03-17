import { nanoid } from 'nanoid';

const testData = [
  {id: nanoid(), name: "item 1", price: 35, important: true, list: "before", visible: true}, 
  {id: nanoid(), name: "item 2", price: 30, important: false, list: "before", visible: true}, 
  {id: nanoid(), name: "item 3", price: 10, important: true, list: "before", visible: true},
  {id: nanoid(), name: "item 4", price: 30, important: false, list: "after", visible: false}, 
  {id: nanoid(), name: "item 5", price: 10, important: true, list: "after", visible: true},
  {id: nanoid(), name: "item 6", price: 35, important: true, list: "before", visible: true}, 
  {id: nanoid(), name: "item 7", price: 30, important: false, list: "before", visible: true}, 
  {id: nanoid(), name: "item 8", price: 10, important: true, list: "before", visible: true},
  {id: nanoid(), name: "item 9", price: 30, important: false, list: "after", visible: false}, 
  {id: nanoid(), name: "item 10", price: 10, important: true, list: "after", visible: true}
]

export default testData;