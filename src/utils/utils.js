/**
 * @file utils
 * @author atom-yang
 */
import uuid from 'uuid/v4';

export const randomId = () => uuid().replace(/-/g, '');

export const isValidHexString = str => /^(0x)?[0-9a-fA-F]+$/.test(str);

export const serializeMessage = data => {
  let result = JSON.stringify(data);
  if (data === null || data === undefined) {
    result = '';
  }
  return btoa(encodeURIComponent(result));
};

export const deserializeMessage = str => {
  let result = decodeURIComponent(atob(str));
  try {
    result = JSON.parse(result);
  } catch (e) {}
  return result;
};
