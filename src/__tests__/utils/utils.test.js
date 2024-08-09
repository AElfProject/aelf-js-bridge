// utils.test.js
import {
  randomId,
  isValidHexString,
  serializeMessage,
  deserializeMessage,
  getUnixTimestamp,
  getUUIDForUrl
} from '../../utils/utils';

describe('randomId', () => {
  test('should generate a valid UUID without dashes', () => {
    const id = randomId();
    expect(id).toHaveLength(32); // UUID without dashes is 32 characters long
    expect(id).not.toMatch(/-/g); // Should not contain any dashes
  });
});

describe('isValidHexString', () => {
  test('validates hex strings correctly', () => {
    expect(isValidHexString('0x123abc')).toBe(true);
    expect(isValidHexString('123ABC')).toBe(true);
    expect(isValidHexString('0x123gbc')).toBe(false);
    expect(isValidHexString('123GBC')).toBe(false);
    expect(isValidHexString('')).toBe(false);
  });
});

describe('serializeMessage', () => {
  test('serializes data correctly', () => {
    const data = { key: 'value' };
    const serialized = serializeMessage(data);
    expect(serialized).toBe(btoa(encodeURIComponent(JSON.stringify(data))));

    const nullSerialized = serializeMessage(null);
    expect(nullSerialized).toBe('');

    const undefinedSerialized = serializeMessage(undefined);
    expect(undefinedSerialized).toBe('');
  });
});

describe('deserializeMessage', () => {
  test('deserializes data correctly', () => {
    const data = { key: 'value' };
    const serializedData = btoa(encodeURIComponent(JSON.stringify(data)));
    const deserialized = deserializeMessage(serializedData);
    expect(deserialized).toEqual(data);

    const invalidData = 'invalid';
    const deserializedInvalid = deserializeMessage(invalidData);
    expect(deserializedInvalid).toEqual(decodeURIComponent(atob(invalidData)));
  });
});

describe('getUnixTimestamp', () => {
  test('returns the correct Unix timestamp', () => {
    const now = Math.ceil(new Date().getTime() / 1000);
    const timestamp = getUnixTimestamp();
    expect(timestamp).toBe(now);
  });
});

describe('getUUIDForUrl', () => {
  test('generates a consistent UUID for the same URL', () => {
    const uuid1 = getUUIDForUrl();
    const uuid2 = getUUIDForUrl();
    expect(uuid1).toEqual(uuid2);
  });
});
