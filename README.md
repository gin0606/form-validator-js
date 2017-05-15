# form-validator-js
## Installation
```sh
npm install --save @gin0606/form-validator

or

yarn add @gin0606/form-validator
```

## Usage
```js
import { FormValidator, Rules, Errors } from '@gin0606/form-validator';

const validator = new FormValidator({
  name: [Rules.cantBeEmpty(), Rules.maxLength(8)],
  email: [Rules.cantBeEmpty(), Rules.acceptEmail()],
  message: [Rules.maxLength(16)],
});

validator.validate({
  name: 'gin0606',
  email: 'email@example.com',
  message: 'hello',
}).then((result) => {
  const errors = result.errors();
  console.log(errors.name); // => []
  console.log(errors.email); // => []
  console.log(errors.message); // => []
});

validator.validate({
  name: 'gin060606',
  email: 'hogehoge',
  message: 'hello hello hello hello',
}).then((result) => {
  const errors = result.errors();
  console.log(errors.name[0] instanceof Errors.MaxLengthError); // => true
  console.log(errors.email[0] instanceof Errors.AcceptEmailError); // => true
  console.log(errors.message[0] instanceof Errors.MaxLengthError); // => true
});

validator.validate({
}).then((result) => {
  const errors = result.errors();
  console.log(!!errors.name.find(e => e instanceof Errors.MustNotBeEmptyError)); // => true
  console.log(!!errors.email.find(e => e instanceof Errors.MustNotBeEmptyError)); // => true
  console.log(errors.message); // => []
});
```
