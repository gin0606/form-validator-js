// @flow
import assert from 'assert';
import isEmpty from 'lodash.isempty';
import Rules from '../src/Rules';
import FormValidator from '../src/FormValidator';
import { includes } from '../src/utils/array';
import * as Errors from '../src/Errors';


describe('FormValidator', () => {
  describe('#validate', () => {
    context('single rule', () => {
      const pattern = /pattern/i;
      const matchPattern = Rules.matchPattern(pattern);
      const rules = {
        key1: [Rules.cantBeEmpty()],
        key2: [matchPattern],
      };
      const validator = new FormValidator(rules);
      context('with valid values', () => {
        it('should not return any error', () => {
          const values = {
            key1: 'value',
            key2: 'pattern',
          };
          return validator.validate(values).then((result) => {
            const errors = result.errors();
            assert.ok(isEmpty(errors.key1));
            assert.ok(isEmpty(errors.key2));
          });
        });
      });
      context('with invalid values', () => {
        it('should return error', () => {
          const values = {
            key1: '',
            key2: 'pattttttern',
          };
          return validator.validate(values).then((result) => {
            const errors = result.errors();
            assert.equal(errors.key1.length, 1);
            assert.equal(errors.key2.length, 1);
            assert.ok(includes(errors.key1, (e) => { return e instanceof Errors.MustNotBeEmptyError; }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof Errors.MustMatchRegExpError) && e.pattern === pattern;
            }));
          });
        });
      });
      context('with invalid empty object', () => {
        const values = {
          // empty object
        };
        it('should return error', () => {
          return validator.validate(values).then((result) => {
            const errors = result.errors();
            assert.ok(errors.key1);
            assert.ok(errors.key2);
            assert.equal(errors.key1.length, 1);
            assert.equal(errors.key2.length, 1);
            assert.ok(includes(errors.key1, (e) => { return e instanceof Errors.MustNotBeEmptyError; }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof Errors.MustMatchRegExpError) && e.pattern === pattern;
            }));
          });
        });
      });
    });
    context('plural rules', () => {
      const hogePattern = /.*hoge.*/i;
      const fugaPattern = /.*fuga.*/i;
      const matchHoge = Rules.matchPattern(hogePattern);
      const matchFuga = Rules.matchPattern(fugaPattern);
      const rules = {
        key1: [Rules.cantBeEmpty(), matchHoge],
        key2: [matchHoge, matchFuga],
      };
      const validator = new FormValidator(rules);
      context('with valid values', () => {
        it('should not return any error', () => {
          const values = {
            key1: 'hoge',
            key2: 'hogefuga',
          };
          return validator.validate(values).then((result) => {
            const errors = result.errors();
            assert.ok(isEmpty(errors.key1));
            assert.ok(isEmpty(errors.key2));
          });
        });
      });
      context('with invalid values', () => {
        it('should return error', () => {
          const values = {
            key1: '',
            key2: 'pattttttern',
          };
          return validator.validate(values).then((result) => {
            const errors = result.errors();
            assert.equal(errors.key1.length, 2);
            assert.equal(errors.key2.length, 2);
            assert.ok(includes(errors.key1, (e) => { return e instanceof Errors.MustNotBeEmptyError; }));
            assert.ok(includes(errors.key1, (e) => {
              return (e instanceof Errors.MustMatchRegExpError) && e.pattern === hogePattern;
            }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof Errors.MustMatchRegExpError) && e.pattern === hogePattern;
            }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof Errors.MustMatchRegExpError) && e.pattern === fugaPattern;
            }));
          });
        });
      });
    });
  });
});
