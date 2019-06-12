const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

const $ = id => document.getElementById(id);

let formInputs = {
  description: $('description'),
  calories: $('calories'),
  carbs: $('carbs'),
  protein: $('protein'),
}

let list = [];

const inputEntries = Object.entries(formInputs);

const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj);
  const attrs = (keys.map(key => `${key}="${obj[key]}"`)).join(' ');
  return attrs;
}

const tagAttrs = obj => (content = '') => 
`<${obj.tag} ${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

const tag = t => {
  if(typeof t === 'string') {
    tagAttrs({tag: t})
  } else {
    tagAttrs(t);
  }
}

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
  }
}

const removeInvalidType = () => {
  inputEntries.forEach(prop => {
    prop[1].addEventListener('keypress', () => {
      formInputs[`${prop[0]}`]
        .classList
          .remove('is-invalid')
    });
  })
}

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

const clearForm = () => Object.values(formInputs).forEach(element => element.value = '');

removeInvalidType();
