// @flow
import assert from 'assert';
import Rules from '../src/Rules';
import * as Errors from '../src/Errors';

type ErrorClass = Class<Errors.ValidationError>;

function spec(subject, rule, valid: mixed | Array<mixed>, invalid: mixed | Array<mixed>, errorType: ErrorClass) {
  describe(subject, () => {
    describe('#verify', () => {
      context(`with '${JSON.stringify(valid)}'`, () => {
        it('should return true', () => {
          const value = Array.isArray(valid) ? valid : [valid];
          return rule.verify(...value)
            .then((result) => {
              assert.equal(result, null);
            });
        });
      });
      context(`with '${JSON.stringify(invalid)}'`, () => {
        it('returns false', () => {
          const value = Array.isArray(invalid) ? invalid : [invalid];
          return rule.verify(...value)
            .then((result) => {
              if (!result) {
                assert.ok(false, 'エラー内容のテストなので無効な値を使って下さい');
              } else {
                assert.ok(result instanceof errorType);
              }
            });
        });
      });
    });
  });
}

describe('ValidationRules', () => {
  spec('mustBeAccepted', Rules.mustBeAccepted(), true, false, Errors.MustBeAcceptedError);
  spec('mustBeAccepted', Rules.mustBeAccepted(), true, null, Errors.MustBeAcceptedError);

  spec('cantBeEmpty', Rules.cantBeEmpty(), 'not empty', '', Errors.MustNotBeEmptyError);
  spec('cantBeEmpty', Rules.cantBeEmpty(), 'not empty', null, Errors.MustNotBeEmptyError);

  spec('matchPattern', Rules.matchPattern(/.*hoge.*/i), 'fugahogeaaa', 'fugahogaaaa', Errors.MustMatchRegExpError);
  spec('matchPattern', Rules.matchPattern(/.*hoge.*/i), 'fugahogeaaa', null, Errors.MustMatchRegExpError);

  spec('range', Rules.range(2, 5), 'aa', 'a', Errors.RangeError);
  spec('range', Rules.range(2, 5), 'aa', null, Errors.RangeError);
  spec('range', Rules.range(2, 5), 'aaaaa', 'aaaaaa', Errors.RangeError);

  spec('minLength', Rules.minLength(2), 'aa', 'a', Errors.MinLengthError);
  spec('minLength', Rules.minLength(2), 'aa', null, Errors.MinLengthError);

  spec('maxLength', Rules.maxLength(5), 'aaaaa', 'aaaaaa', Errors.MaxLengthError);
  spec('maxLength', Rules.maxLength(5), null, 'aaaaaa', Errors.MaxLengthError);

  spec('oneOf', Rules.oneOf(['a', 'b', 'c']), 'a', 'd', Errors.MustBelongsToError);
  spec('oneOf', Rules.oneOf(['a', 'b', 'c']), 'a', null, Errors.MustBelongsToError);

  spec('acceptEmail', Rules.acceptEmail(), 'username@example.com', 'username', Errors.AcceptEmailError);
  spec('acceptEmail', Rules.acceptEmail(), 'username@example.com', 'username@', Errors.AcceptEmailError);
  spec('acceptEmail', Rules.acceptEmail(), 'username@example.com', '@example.com', Errors.AcceptEmailError);
  spec('acceptEmail', Rules.acceptEmail(), 'username@example.com', 'username@@@example.com', Errors.AcceptEmailError);
  spec('acceptEmail', Rules.acceptEmail(), 'username@example.com', 'username..@example.com', Errors.AcceptEmailError);
  spec('acceptEmail', Rules.acceptEmail(), 'username@example.com', ' username@example.com ', Errors.AcceptEmailError);

  spec('passwordPattern', Rules.passwordPattern(), 'validpassword', '無効なpassword', Errors.PasswordPatternError);
  spec('passwordPattern', Rules.passwordPattern(), '!#$%&*+-.,:;?@^`\'"|~=<>', '無効なpassword', Errors.PasswordPatternError);
  spec('passwordPattern', Rules.passwordPattern(),
    'longPasswordxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'longPasswordxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Errors.PasswordLengthError);
  spec('passwordPattern', Rules.passwordPattern(),
    'shortpas',
    'shortpa', Errors.PasswordLengthError);

  spec('passwordConfirm', Rules.passwordConfirm('password'), ['password', { password: 'password' }], ['invalid', { password: 'password' }], Errors.PasswordConfirmError);
  spec('passwordConfirm', Rules.passwordConfirm('password'), ['password', { password: 'password' }], ['password', { invalidKey: 'password' }], Errors.PasswordConfirmError);
  spec('passwordConfirm', Rules.passwordConfirm('password'), ['password', { password: 'password' }], ['password', {}], Errors.PasswordConfirmError);
  spec('passwordConfirm', Rules.passwordConfirm('password'), ['password', { password: 'password' }], ['password', null], Errors.PasswordConfirmError);
});
