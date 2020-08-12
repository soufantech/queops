import { stringParser } from '../../scalar';

describe('stringParser', () => {
  it('returns its input when given no options object.', () => {
    const parseString = stringParser();

    const INPUT = 'aerographite';

    const parsed = parseString(INPUT);

    expect(parsed.value).toBe(INPUT);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns its input when given an empty options object.', () => {
    const parseString = stringParser({});

    const INPUT = 'aerographite';

    const parsed = parseString(INPUT);

    expect(parsed.value).toBe(INPUT);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns its input when given a pattern regexp option that matches the input.', () => {
    const parseString = stringParser({ pattern: /c/ });

    const INPUT = 'carbon';

    const parsed = parseString(INPUT);

    expect(parsed.value).toBe(INPUT);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns an undefined value when given a pattern regexp option that does not match the input.', () => {
    const parseString = stringParser({ pattern: /c/ });

    const INPUT = 'benzene';

    const parsed = parseString(INPUT);

    expect(parsed.value).toBeUndefined();
    expect(parsed.opcode).toBeUndefined();
  });
});
