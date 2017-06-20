// @flow
/* eslint arrow-parens: ["error", "always"] */
import FormResult from './FormResult';
import ValidationError from './Errors';

// Promise は reject 時の型を指定出来ないので Validation に失敗しても resolve としてる
export type RuleType = {|
  verify: (any, { [string]: any }) => Promise<?ValidationError>,
|}

export type FormRule = {
  [string]: Array<RuleType>
}

export default class FormValidator {
  rule: FormRule

  constructor(rule: FormRule) {
    this.rule = rule;
  }

  async validate(values: { [string]: any }): Promise<FormResult> {
    const errorPromises = Object.keys(this.rule).map(async (key) => {
      const rules = this.rule[key];
      return Promise.all(rules.map((rule) => (rule.verify(values[key], values))))
        .then((e) => ({ [key]: e }));
    });
    const formErrors = await Promise.all(errorPromises)
      .then((errors) => errors.reduce((result, accumulator) => (
        Object.assign({}, result, Object.keys(accumulator).reduce((reslt, key) => (
          Object.assign({}, reslt, { [key]: accumulator[key].filter((ee) => ee) })
        ), {}))
      ), {}));

    return new FormResult(formErrors);
  }
}
