// @flow
import _FormResult from './FormResult';
import _FormValidator from './FormValidator';
import _ValidationError from './Errors';
import type { RuleType as _RuleType, FormRule as _FormRule } from './FormValidator';

export type FormRule = _FormRule;
export type RuleType = _RuleType;

export const ValidationError = _ValidationError;
export const FormResult = _FormResult;
export const FormValidator = _FormValidator;
