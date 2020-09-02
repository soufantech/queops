import { integerParser } from '../../scalar';

const MAX_SAFE_INT = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INT = Number.MIN_SAFE_INTEGER;
const MAX_SAFE_INT_STR = MAX_SAFE_INT.toString();
const MIN_SAFE_INT_STR = MIN_SAFE_INT.toString();
const UNSAFE_NEG_INT_STR = `${MIN_SAFE_INT_STR}9`;
const UNSAFE_POS_INT_STR = `${MAX_SAFE_INT_STR}9`;

describe('integerParser', () => {
  it.each`
    input               | output
    ${'-0'}             | ${-0}
    ${'0'}              | ${0}
    ${'+0'}             | ${0}
    ${'123'}            | ${123}
    ${'+123'}           | ${123}
    ${'-123'}           | ${-123}
    ${'0.0'}            | ${0}
    ${'-0.0'}           | ${-0}
    ${'15min'}          | ${15}
    ${'-15min'}         | ${-15}
    ${'-125.23'}        | ${-125}
    ${'125.23'}         | ${125}
    ${'125,23'}         | ${125}
    ${MIN_SAFE_INT_STR} | ${MIN_SAFE_INT}
    ${MAX_SAFE_INT_STR} | ${MAX_SAFE_INT}
  `(
    'returns a parsed integer when input is a valid number representation.',
    ({ input, output }) => {
      const parseInteger = integerParser();

      const parsed = parseInteger(input);

      expect(parsed.value).toBe(output);
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input               | min             | max             | output
    ${'0'}              | ${-1}           | ${1}            | ${0}
    ${'0'}              | ${-5}           | ${5}            | ${0}
    ${'0'}              | ${0}            | ${0}            | ${0}
    ${'-2'}             | ${-3}           | ${-1}           | ${-2}
    ${'5'}              | ${5}            | ${5}            | ${5}
    ${'5'}              | ${5}            | ${7}            | ${5}
    ${'5'}              | ${3}            | ${5}            | ${5}
    ${'5'}              | ${3}            | ${7}            | ${5}
    ${MAX_SAFE_INT_STR} | ${MAX_SAFE_INT} | ${undefined}    | ${MAX_SAFE_INT}
    ${MIN_SAFE_INT_STR} | ${undefined}    | ${MIN_SAFE_INT} | ${MIN_SAFE_INT}
    ${MAX_SAFE_INT_STR} | ${MAX_SAFE_INT} | ${MAX_SAFE_INT} | ${MAX_SAFE_INT}
    ${MIN_SAFE_INT_STR} | ${MIN_SAFE_INT} | ${MIN_SAFE_INT} | ${MIN_SAFE_INT}
    ${'0'}              | ${-0}           | ${+0}           | ${0}
    ${'0'}              | ${0}            | ${-0}           | ${0}
    ${'-0'}             | ${-0}           | ${+0}           | ${-0}
    ${'-0'}             | ${0}            | ${-0}           | ${-0}
  `(
    'returns an integer value when input is a valid number between max and min arguments.',
    ({ input, min, max, output }) => {
      const parseInteger = integerParser({ min, max });

      const parsed = parseInteger(input);

      expect(parsed.value).toBe(output);
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input
    ${'++0'}
    ${''}
    ${'five5'}
    ${'five'}
    ${'Infinity'}
    ${'-Infinity'}
    ${'+Infinity'}
    ${'NaN'}
    ${UNSAFE_NEG_INT_STR}
    ${UNSAFE_POS_INT_STR}
  `(
    'returns an undefined value when its input is not a valid integer representation.',
    ({ input }) => {
      const parseInteger = integerParser();

      const parsed = parseInteger(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input               | min          | max
    ${'0'}              | ${1}         | ${-1}
    ${'-10'}            | ${-5}        | ${5}
    ${'10'}             | ${-5}        | ${5}
    ${'-3'}             | ${-10}       | ${-5}
    ${MAX_SAFE_INT_STR} | ${undefined} | ${5}
    ${MIN_SAFE_INT_STR} | ${-5}        | ${undefined}
  `(
    'returns an undefined value when input is a valid number but is not between max and min arguments.',
    ({ input, min, max }) => {
      const parseInteger = integerParser({ min, max });

      const parsed = parseInteger(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );
});
