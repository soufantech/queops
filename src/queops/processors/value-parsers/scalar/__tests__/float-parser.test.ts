import { floatParser } from '../../scalar';

const MAX_SAFE_FLOAT = Number.MAX_VALUE;
const MIN_SAFE_FLOAT = -Number.MAX_VALUE;
const MIN_PRECISE_FLOAT = Number.MIN_VALUE;
const MAX_SAFE_FLOAT_STR = MAX_SAFE_FLOAT.toString();
const MIN_SAFE_FLOAT_STR = MIN_SAFE_FLOAT.toString();
const UNSAFE_POS_FLOAT_STR = '1.7976931348623157e+309'; // = +Infinite
const UNSAFE_NEG_FLOAT_STR = '-1.7976931348623157e+309'; // = -Infinite

describe('floatParser', () => {
  it.each`
    input                 | output
    ${'-0'}               | ${-0}
    ${'-0.0'}             | ${-0}
    ${'0.0'}              | ${0}
    ${'+0'}               | ${0}
    ${'+0.0'}             | ${0}
    ${'123'}              | ${123}
    ${'+123'}             | ${123}
    ${'-123'}             | ${-123}
    ${'0.1235'}           | ${0.1235}
    ${'-0.0'}             | ${-0}
    ${'15min'}            | ${15}
    ${'-15min'}           | ${-15}
    ${'-125.23'}          | ${-125.23}
    ${'125.23'}           | ${125.23}
    ${'125,23'}           | ${125}
    ${MIN_SAFE_FLOAT_STR} | ${MIN_SAFE_FLOAT}
    ${MAX_SAFE_FLOAT_STR} | ${MAX_SAFE_FLOAT}
    ${'5e-324'}           | ${MIN_PRECISE_FLOAT}
    ${'5e-325'}           | ${0}
    ${'1.25523e3'}        | ${1255.23}
  `(
    'returns a parsed float when input is a valid number representation.',
    ({ input, output }) => {
      const parseFloat = floatParser();

      const parsed = parseFloat(input);

      expect(parsed.value).toBe(output);
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input                 | min               | max               | output
    ${'0'}                | ${-1.99}          | ${0.01}           | ${0}
    ${'0'}                | ${-5}             | ${5}              | ${0}
    ${'0'}                | ${0}              | ${0}              | ${0}
    ${'-1.98'}            | ${-1.98}          | ${-1.97}          | ${-1.98}
    ${'1.98'}             | ${1.98}           | ${1.98}           | ${1.98}
    ${'1.98'}             | ${1.97}           | ${1.99}           | ${1.98}
    ${'1.98'}             | ${1.97}           | ${1.98}           | ${1.98}
    ${'1.98'}             | ${1.98}           | ${1.99}           | ${1.98}
    ${MAX_SAFE_FLOAT_STR} | ${MAX_SAFE_FLOAT} | ${undefined}      | ${MAX_SAFE_FLOAT}
    ${MIN_SAFE_FLOAT_STR} | ${undefined}      | ${MIN_SAFE_FLOAT} | ${MIN_SAFE_FLOAT}
    ${MAX_SAFE_FLOAT_STR} | ${MAX_SAFE_FLOAT} | ${MAX_SAFE_FLOAT} | ${MAX_SAFE_FLOAT}
    ${MIN_SAFE_FLOAT_STR} | ${MIN_SAFE_FLOAT} | ${MIN_SAFE_FLOAT} | ${MIN_SAFE_FLOAT}
    ${'0'}                | ${-0}             | ${+0}             | ${0}
    ${'0'}                | ${0}              | ${-0}             | ${0}
    ${'-0'}               | ${-0}             | ${+0}             | ${-0}
    ${'-0'}               | ${0}              | ${-0}             | ${-0}
  `(
    'returns a float value when input is a valid number between max and min arguments.',
    ({ input, min, max, output }) => {
      const parseFloat = floatParser({ min, max });

      const parsed = parseFloat(input);

      expect(parsed.value).toBe(output);
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input
    ${'++0.0'}
    ${''}
    ${'five5'}
    ${'n5.02'}
    ${'five'}
    ${'Infinity'}
    ${'-Infinity'}
    ${'+Infinity'}
    ${'NaN'}
    ${UNSAFE_POS_FLOAT_STR}
    ${UNSAFE_NEG_FLOAT_STR}
  `(
    'returns an undefined value when its input is not a valid float representation.',
    ({ input }) => {
      const parseFloat = floatParser();

      const parsed = parseFloat(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input             | min          | max
    ${'0'}            | ${0.001}     | ${-0.001}
    ${'-1.891'}       | ${-1.89}     | ${1.9}
    ${'1.8'}          | ${-1.89}     | ${1.7}
    ${MAX_SAFE_FLOAT} | ${undefined} | ${0.1}
    ${MIN_SAFE_FLOAT} | ${-0.1}      | ${undefined}
  `(
    'returns an undefined value when input is a valid number but is not between max and min arguments.',
    ({ input, min, max }) => {
      const parseFloat = floatParser({ min, max });

      const parsed = parseFloat(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );
});
