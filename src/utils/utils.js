/**
 * @file utils
 * @author atom-yang
 */
import uuidv4 from 'uuid/v4';
import uuidv5 from 'uuid/v5';

export const randomId = () => uuidv4().replace(/-/g, '');

export const isValidHexString = str => /^(0x)?[0-9a-fA-F]+$/.test(str);

export const serializeMessage = data => {
  let result = JSON.stringify(data);
  if (data === null || data === undefined) {
    result = '';
  }
  return btoa(encodeURIComponent(result));
};

export const deserializeMessage = str => {
  let result = {};
  try {
    result = decodeURIComponent(atob(str));
    result = JSON.parse(result);
  } catch (e) {}
  return result;
};

export const getUnixTimestamp = () => Math.ceil(new Date().getTime() / 1000);

export const getUUIDForUrl = () => uuidv5(`${window.location.origin}${window.location.pathname}`, uuidv5.URL);
