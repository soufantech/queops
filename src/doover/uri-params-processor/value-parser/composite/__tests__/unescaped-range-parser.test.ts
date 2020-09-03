import { integerParser } from '../../scalar';
import { unescapedRangeParser } from '../../composite';

describe('unescapedRangeParser', () => {
  it('returns a tuple of parsed inputs.', () => {
    const parseRange = unescapedRangeParser(integerParser());

    const INPUT = '5..25';

    const parsed = parseRange(INPUT);

    expect(parsed.value).toStrictEqual([5, 25]);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns a tuple of parsed inputs with a custom separator.', () => {
    const parseRange = unescapedRangeParser(integerParser(), {
      separator: '<-->',
    });

    const INPUT = '5<-->25';

    const parsed = parseRange(INPUT);

    expect(parsed.value).toStrictEqual([5, 25]);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns an undefined value if input is empty.', () => {
    const parseRange = unescapedRangeParser(integerParser());

    const INPUT = '';

    const parsed = parseRange(INPUT);

    expect(parsed.value).toBeUndefined();
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns a tuple even when more input is given.', () => {
    const parseRange = unescapedRangeParser(integerParser());

    const INPUT = '5..25..50';

    const parsed = parseRange(INPUT);

    expect(parsed.value).toStrictEqual([5, 25]);
    expect(parsed.opcode).toBeUndefined();
  });

  it('ignores unparseable elements after the first two valid elements.', () => {
    const parseRange = unescapedRangeParser(integerParser());

    const INPUT = '5..25..X,X,15..12';

    const parsed = parseRange(INPUT);

    expect(parsed.value).toStrictEqual([5, 25]);
    expect(parsed.opcode).toBeUndefined();
  });

  it.each`
    input
    ${'5..X'}
    ${'X..5'}
    ${'X..X'}
    ${'..X'}
    ${'X..'}
    ${'5..'}
    ${'..5'}
    ${'..'}
  `(
    'returns an undefined value if any of the elements fail to be parsed.',
    ({ input }) => {
      const parseRange = unescapedRangeParser(integerParser());

      const parsed = parseRange(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );
});
