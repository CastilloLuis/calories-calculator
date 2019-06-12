const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

/**
 * Find element in DOM by id and returns it
 * @param {*} id 
 */
const $ = id => document.getElementById(id);

let formInputs = {
  description: $('description'),
  calories: $('calories'),
  carbs: $('carbs'),
  protein: $('protein'),
}

let list = [];

const inputEntries = Object.entries(formInputs);

/**
 * Declarative function that generate props for html tags
 * @param {*} obj 
 */
const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj);
  const attrs = (keys.map(key => `${key}="${obj[key]}"`)).join(' ');
  return attrs;
}

/**
 *  Function that generate html tags using function composition 
 * @param {*} obj 
*/
const tagAttrs = obj => (content = '') => `<${obj.tag} ${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

/**
 * Function to generate tags with attrs or not.
 * @param {*} t 
*/
const tag = t => {
  if(typeof t === 'string') {
    return tagAttrs({tag: t})
  } else {
    return tagAttrs(t);
  }
}

const tableRowTag = tag('tr');
const tableRow = items => compose(tableRowTag, tableCells)(items);

const tableCell = tag('td'); // generate one cell
const tableCells = items => items.map(tableCell).join(''); // iterating over items and generate item.length cells

const trashIcon = tag({tag: 'i', attrs: {class: 'fas fa-trash-alt'}})('')

/**
 * Validates inputs
*/
const validateInputs = () => {
  inputEntries.forEach(prop => {
    if (!prop[1].value) {
      formInputs[`${prop[0]}`]
        .classList
          .add('is-invalid');
    }
  });

  if(Object.values(formInputs).every(({ value }) => value)) {
    addToList();
    clearForm();
    updateTotals();
    renderItems()
  }
}

/**
 * Remove invalid types in inputs that are keypressed
*/

const removeInvalidType = () => {
  inputEntries.forEach(prop => {
    prop[1].addEventListener('keypress', () => {
      formInputs[`${prop[0]}`]
        .classList
          .remove('is-invalid')
    });
  })
}

/**
 * Add new item to list.
*/
const addToList = () => {
  const { description, calories, carbs, protein } = formInputs;
  const newItem = {
    description: description.value,
    calories: +calories.value,
    carbs: +carbs.value,
    protein: +protein.value
  }
  list.push(newItem);
}

/**
 * Updates totals of list items
*/
const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0;
  list.map(item => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  });
  $('totalCalories').innerText = calories;
  $('totalCarbs').innerText = carbs;
  $('totalProtein').innerText = protein;
}

/**
 * Remove items from list by index
 * @param {*} index 
 */
const removeItemFromList = (index) => {
  list.splice(index, 1);
  updateTotals();
  renderItems();
}

/**
 * Render rows in tbody
 */
const renderItems = () => {
  const table = $('table-body');
  table.innerHTML = '';
  const rows = list.map(({ description, calories, carbs, protein }, index) => {
    const removeButton = tag({
      tag: 'button', 
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItemFromList(${index})`,
      }
    })(trashIcon);
    // console.log(removeButton)
    return tableRow([description, calories, carbs, protein, removeButton]);
  });
  table.innerHTML = rows.join('');
}

/**
 * Removes all the tbody's child
*/

const clearForm = () => Object.values(formInputs).forEach(element => element.value = '');

removeInvalidType();
