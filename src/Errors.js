// @flow
export class ValidationError {
}

export class MustBeAcceptedError extends ValidationError {
}
export class MustNotBeEmptyError extends ValidationError {
}
export class MustMatchRegExpError extends ValidationError {
  pattern: RegExp
  constructor(pattern: RegExp) {
    super();
    this.pattern = pattern;
  }
}
export class RangeError extends ValidationError {
  min: number
  max: number

  constructor(min: number, max: number) {
    super();
    this.min = min;
    this.max = max;
  }
}
export class MinLengthError extends ValidationError {
  min: number
  constructor(min: number) {
    super();
    this.min = min;
  }
}
export class MaxLengthError extends ValidationError {
  max: number
  constructor(max: number) {
    super();
    this.max = max;
  }
}
export class MustBelongsToError extends ValidationError {
  choices: Array<any>
  constructor(choices: Array<any>) {
    super();
    this.choices = choices;
  }
}
export class PasswordLengthError extends ValidationError {
  min: number
  max: number

  constructor(min: number, max: number) {
    super();
    this.min = min;
    this.max = max;
  }
}
export class PasswordPatternError extends ValidationError {
  pattern: RegExp
  constructor(pattern: RegExp) {
    super();
    this.pattern = pattern;
  }
}
export class PasswordConfirmError extends ValidationError {
}
export class AcceptEmailError extends ValidationError {
}
export class AcceptImageError extends ValidationError {
  types: Array<string>
  constructor(types: Array<string>) {
    super();
    this.types = types;
  }
}
export class AcceptJsonFileError extends ValidationError {
}
export class FileSizeError extends ValidationError {
  size: number
  constructor(size: number) {
    super();
    this.size = size;
  }
}
