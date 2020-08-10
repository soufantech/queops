import { enumParser } from '../../scalar';

describe('enumParser', () => {
  it('returns its input when its input is contained in its values argument.', () => {
    const parseEnum = enumParser(['asc', 'desc']);

    const INPUT = 'desc';

    const parsed = parseEnum(INPUT);

    expect(parsed.value).toBe(INPUT);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns an undefined value when its input is not contained in its values argument.', () => {
    const parseEnum = enumParser(['asc', 'desc']);

    const INPUT = 'transversal';

    const parsed = parseEnum(INPUT);

    expect(parsed.value).toBeUndefined();
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns a transformed input when when input is contained in its values argument and a trasform function is given as option.', () => {
    const parseEnum = enumParser(['asc', 'desc'], {
      transform: (e) => e.toUpperCase(),
    });

    const INPUT = 'asc';

    const parsed = parseEnum(INPUT);

    expect(parsed.value).toBe('ASC');
    expect(parsed.opcode).toBeUndefined();
  });
});
