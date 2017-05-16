// @flow
/* eslint arrow-body-style: ["error", "as-needed"], arrow-parens: ["error", "always"], no-duplicate-imports: off */
import validatorjs from 'validator';
import isEmpty from 'lodash.isempty';
import inRange from 'lodash.inrange';
import { includes } from './utils/array';
import isJsonFile from './utils/isJsonFile';
import * as Errors from './Errors';

const isNotEmpty = (v) => (!isEmpty(v));
const PasswordPattern = /^[\w\d!#$%&*+-.,:;?@^`'"|~=<>/\\()[\]{}]*$/;

// Promise は reject 時の型を指定出来ないので Validation に失敗しても resolve としてる
export type RuleType = {|
  verify: (any) => Promise<?Errors.ValidationError>,
|}

export type RulesType = {|
  mustBeAccepted: () => RuleType,
  cantBeEmpty: () => RuleType,
  matchPattern: (pattern: RegExp) => RuleType,
  range: (min: number, max: number) => RuleType,
  minLength: (min: number) => RuleType,
  maxLength: (max: number) => RuleType,
  oneOf: (choices: Array<any>) => RuleType,
  passwordPattern: () => RuleType,
  passwordConfirm: (key: string) => RuleType,
  acceptEmail: () => RuleType,
  acceptImage: () => RuleType,
  acceptJson: () => RuleType,
  fileSize: (size: number) => RuleType,
|}

const rules: RulesType = {
  mustBeAccepted: () => ({
    verify: (v: boolean) => Promise.resolve(v ? null : new Errors.MustBeAcceptedError()),
  }),
  cantBeEmpty: () => ({
    verify: (v: string) => Promise.resolve((isNotEmpty(v) ? null : new Errors.MustNotBeEmptyError())),
  }),
  matchPattern: (pattern: RegExp) => ({
    verify: (v: string) => Promise.resolve(((v && validatorjs.matches(v, pattern))
      ? null : new Errors.MustMatchRegExpError(pattern))),
  }),
  range: (min, max) => ({
    verify: (v: string) => {
      let error = null;
      if (!v || (v && !inRange(v.length, min, max + 1))) {
        error = new Errors.RangeError(min, max);
      }
      return Promise.resolve(error);
    },
  }),
  minLength: (min) => ({
    verify: (v: string) => {
      let error = null;
      if (!v || (v && v.length < min)) {
        error = new Errors.MinLengthError(min);
      }
      return Promise.resolve(error);
    },
  }),
  maxLength: (max) => ({
    verify: (v: string) => {
      let error = null;
      if (v && v.length > max) {
        error = new Errors.MaxLengthError(max);
      }
      return Promise.resolve(error);
    },
  }),
  oneOf: (choices: Array<any>) => ({
    verify: (v: string) => Promise.resolve((includes(choices, v) ? null : new Errors.MustBelongsToError(choices))),
  }),
  passwordPattern: () => ({
    verify: (v: string) => {
      let error = null;
      if (!v) { error = new Errors.PasswordLengthError(8, 64); }
      if (!inRange(v.length, 8, 65)) {
        error = new Errors.PasswordLengthError(8, 64);
      }
      if (!validatorjs.matches(v, PasswordPattern)) {
        error = new Errors.PasswordPatternError(PasswordPattern);
      }
      return Promise.resolve(error);
    },
  }),
  passwordConfirm: (key: string) => ({
    verify: (v: string, values: ?{ [string]: any }) => {
      let error = null;
      if (!values) {
        error = new Errors.PasswordConfirmError();
      }
      if (values && values[key] !== v) {
        error = new Errors.PasswordConfirmError();
      }
      return Promise.resolve(error);
    },
  }),
  acceptEmail: () => ({
    verify: (v: string) => {
      if (!v) { return Promise.resolve(null); }
      if (validatorjs.isEmail(v)) { return Promise.resolve(null); }
      return Promise.resolve(new Errors.AcceptEmailError());
    },
  }),
  acceptImage: (types: Array<string> = []) => ({
    verify: (v: FileList) => {
      if (!v) { return Promise.resolve(null); }
      for (let i = 0; i < v.length; i += 1) {
        const file = v[i];
        if (!validatorjs.matches(file.type, /^image\/.*/)) {
          return Promise.resolve(new Errors.AcceptImageError(types));
        }
        if (isNotEmpty(types) && !includes(types, file.type)) {
          return Promise.resolve(new Errors.AcceptImageError(types));
        }
      }
      return Promise.resolve(null);
    },
  }),
  acceptJson: () => ({
    verify: (v: FileList) => {
      if (!v) { return Promise.resolve(null); }
      return new Promise(async (resolve) => {
        const resultPromises: Array<Promise<boolean>> = [];
        for (let i = 0; i < v.length; i += 1) {
          const file = v[i];
          resultPromises.push(isJsonFile(file));
        }
        const results = await Promise.all(resultPromises);
        resolve(results.every((e) => e) ? null : new Errors.AcceptJsonFileError());
      });
    },
  }),
  fileSize: (size: number) => ({
    verify: (v: FileList) => {
      if (!v) { return Promise.resolve(null); }
      for (let i = 0; i < v.length; i += 1) {
        const file = v[i];
        if (file.size > size) {
          return Promise.resolve(new Errors.FileSizeError(size));
        }
      }
      return Promise.resolve(null);
    },
  }),
};

export default rules;
