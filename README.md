# form-validator-js
## Installation
```sh
npm install --save @gin0606/form-validator

or

yarn add @gin0606/form-validator
```

## Usage
```js
import { FormValidator, Errors } from '@gin0606/form-validator';

class MustNotBeEmptyError extends ValidationError {
}
class MaxLengthError extends ValidationError {
  max: number
  constructor(max: number) {
    super();
    this.max = max;
  }
}

const Rules = {
  cantBeEmpty: () => ({
    verify: (v: string): Promise<?ValidationError> => Promise.resolve((isNotEmpty(v) ? null : new MustNotBeEmptyError())),
  }),
  maxLength: (max: number) => ({
    verify: (v: string): Promise<?ValidationError> => {
      let error = null;
      if (v && v.length > max) {
        error = new MaxLengthError(max);
      }
      return Promise.resolve(error);
    },
  }),
  acceptEmail: () => ({
    verify: (v: string): Promise<?ValidationError> => {
      if (!v) { return Promise.resolve(null); }
      if (isEmail(v)) { return Promise.resolve(null); }
      return Promise.resolve(new AcceptEmailError());
    },
  }),
};

const validator = new FormValidator({
  name: [Rules.cantBeEmpty(), Rules.maxLength(8)],
  message: [Rules.maxLength(16)],
});

validator.validate({
  name: 'gin0606',
  message: 'hello',
}).then((result) => {
  const errors = result.errors();
  console.log(errors.name); // => []
  console.log(errors.email); // => []
  console.log(errors.message); // => []
});

validator.validate({
  name: 'gin060606',
  message: 'hello hello hello hello',
}).then((result) => {
  const errors = result.errors();
  console.log(errors.name[0] instanceof MaxLengthError); // => true
  console.log(errors.message[0] instanceof MaxLengthError); // => true
});

validator.validate({
}).then((result) => {
  const errors = result.errors();
  console.log(!!errors.name.find(e => e instanceof MustNotBeEmptyError)); // => true
  console.log(errors.message); // => []
});
```
