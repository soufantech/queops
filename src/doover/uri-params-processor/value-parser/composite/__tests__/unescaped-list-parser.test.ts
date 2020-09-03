import { integerParser } from '../../scalar';
import { unescapedListParser } from '../../composite';

describe('unescapedListParser', () => {
  it('returns a list of parsed inputs.', () => {
    const parseList = unescapedListParser(integerParser());

    const INPUT = '11,12,13';

    const parsed = parseList(INPUT);

    expect(parsed.value).toStrictEqual([11, 12, 13]);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns a list of parsed inputs with a custom separator.', () => {
    const parseList = unescapedListParser(integerParser(), { separator: '::' });

    const INPUT = '11::12::13';

    const parsed = parseList(INPUT);

    expect(parsed.value).toStrictEqual([11, 12, 13]);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns an undefined value if input is empty.', () => {
    const parseList = unescapedListParser(integerParser());

    const INPUT = '';

    const parsed = parseList(INPUT);

    expect(parsed.value).toBeUndefined();
    expect(parsed.opcode).toBeUndefined();
  });

  it.each`
    maxElements | input         | output
    ${1}        | ${'11'}       | ${[11]}
    ${1}        | ${'11,12'}    | ${[11]}
    ${1}        | ${'11,12,13'} | ${[11]}
    ${3}        | ${'11,12,13'} | ${[11, 12, 13]}
    ${2}        | ${'11,12,13'} | ${[11, 12]}
  `(
    'returns a capped list if maxElements parameter is especified.',
    ({ maxElements, output, input }) => {
      const parseList = unescapedListParser(integerParser(), { maxElements });

      const parsed = parseList(input);

      expect(parsed.value).toStrictEqual(output);
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it('returns an undefined value if maxElements is 0.', () => {
    const parseList = unescapedListParser(integerParser(), { maxElements: 0 });

    const INPUT = '11,12,13';

    const parsed = parseList(INPUT);

    expect(parsed.value).toBeUndefined();
    expect(parsed.opcode).toBeUndefined();
  });

  it('ignores unparseable elements after that occurs after maxElements.', () => {
    const parseList = unescapedListParser(integerParser(), { maxElements: 3 });

    const INPUT = '11,12,13,X,15';

    const parsed = parseList(INPUT);

    expect(parsed.value).toStrictEqual([11, 12, 13]);
    expect(parsed.opcode).toBeUndefined();
  });

  it.each`
    input
    ${'11,X,13'}
    ${'X'}
    ${','}
    ${',12'}
    ${'12,'}
  `(
    'returns an undefined value if any of the elements fail to be parsed.',
    ({ input }) => {
      const parseList = unescapedListParser(integerParser());

      const parsed = parseList(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );
});
