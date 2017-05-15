// @flow
import { ValidationError } from './Errors';

export default class FormResult {
  formErrors: { [string]: Array<ValidationError> };

  constructor(formErrors: { [string]: Array<ValidationError> }) {
    this.formErrors = formErrors;
  }

  errors(): { [string]: Array<ValidationError> } {
    return this.formErrors;
  }
}
