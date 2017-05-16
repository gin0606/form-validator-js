// @flow
import _FormResult from './FormResult';
import rules from './Rules';
import _FormValidator from './FormValidator';
import type { FormRule as _FormRule } from './FormValidator';
import type { RuleType as _RuleType, RulesType as _RulesType } from './Rules';

export type FormRule = _FormRule;
export type RuleType = _RuleType;
export type RulesType = _RulesType;

export * as Errors from './Errors';
export const FormResult = _FormResult;
export const Rules = rules;
export const FormValidator = _FormValidator;
