import { booleanParser } from '../../scalar';

describe('booleanParser', () => {
  it('returns true if input is "true".', () => {
    const parseBoolean = booleanParser();

    const INPUT = 'true';

    const parsed = parseBoolean(INPUT);

    expect(parsed.value).toBe(true);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns false if input is "false".', () => {
    const parseBoolean = booleanParser();

    const INPUT = 'false';

    const parsed = parseBoolean(INPUT);

    expect(parsed.value).toBe(false);
    expect(parsed.opcode).toBeUndefined();
  });

  it('returns an undefined value when input is neither "true" nor "false".', () => {
    const parseBoolean = booleanParser();

    const INPUT = 'maybe';

    const parsed = parseBoolean(INPUT);

    expect(parsed.value).toBeUndefined;
    expect(parsed.opcode).toBeUndefined();
  });
});
