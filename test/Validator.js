// @flow
import assert from 'assert';
import validatorjs from 'validator';
import FormValidator from '../src/FormValidator';
import ValidationError from '../src/Errors';

function includes<T>(array: Array<T>, compare: T => boolean): boolean {
  const index = array.findIndex(compare);
  return index !== -1;
}
const isNotEmpty = (v: string) => (v && v.length > 0);

class MustBeAcceptedError extends ValidationError {}
class MustNotBeEmptyError extends ValidationError {}
class MustMatchRegExpError extends ValidationError {
  pattern: RegExp
  constructor(pattern: RegExp) {
    super();
    this.pattern = pattern;
  }
}

const Rules = {
  mustBeAccepted: () => ({
    verify: (v: boolean) => Promise.resolve(v ? null : new MustBeAcceptedError()),
  }),
  cantBeEmpty: () => ({
    verify: (v: string) => Promise.resolve((isNotEmpty(v) ? null : new MustNotBeEmptyError())),
  }),
  matchPattern: (pattern: RegExp) => ({
    verify: (v: string) => Promise.resolve(((v && validatorjs.matches(v, pattern))
      ? null : new MustMatchRegExpError(pattern))),
  }),
};

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
            assert.ok(errors.key1.length === 0);
            assert.ok(errors.key2.length === 0);
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
            assert.ok(includes(errors.key1, (e) => { return e instanceof MustNotBeEmptyError; }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof MustMatchRegExpError) && e.pattern === pattern;
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
            assert.ok(includes(errors.key1, (e) => { return e instanceof MustNotBeEmptyError; }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof MustMatchRegExpError) && e.pattern === pattern;
            }));
          });
        });
      });
      context('with null', () => {
        const values = null;
        it('should return error', () => {
          return validator.validate(values).then((result) => {
            const errors = result.errors();
            assert.ok(errors.key1);
            assert.ok(errors.key2);
            assert.equal(errors.key1.length, 1);
            assert.equal(errors.key2.length, 1);
            assert.ok(includes(errors.key1, (e) => { return e instanceof MustNotBeEmptyError; }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof MustMatchRegExpError) && e.pattern === pattern;
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
            assert.ok(errors.key1.length === 0);
            assert.ok(errors.key2.length === 0);
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
            assert.ok(includes(errors.key1, (e) => { return e instanceof MustNotBeEmptyError; }));
            assert.ok(includes(errors.key1, (e) => {
              return (e instanceof MustMatchRegExpError) && e.pattern === hogePattern;
            }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof MustMatchRegExpError) && e.pattern === hogePattern;
            }));
            assert.ok(includes(errors.key2, (e) => {
              return (e instanceof MustMatchRegExpError) && e.pattern === fugaPattern;
            }));
          });
        });
      });
    });
  });
});
