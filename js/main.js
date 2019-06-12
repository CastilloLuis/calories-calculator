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

const validateInputs = () => {
  inputEntries.forEach(prop => {
    if (!prop[1].value) {
      formInputs[`${prop[0]}`]
        .classList
          .add('is-invalid');
    }
  });

  if(Object.values(formInputs).every(({ value }) => value)) {
    alert('All inputs are fill')
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

removeInvalidType();

