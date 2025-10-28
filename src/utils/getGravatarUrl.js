// src/utils/getGravatarUrl.js
import md5 from 'md5';

export function getGravatarUrl(email) {
  if (!email || !email.trim()) {
    return 'https://www.gravatar.com/avatar/?d=mp&s=100';
  }

  const hash = md5(email.trim().toLowerCase());
  // d=identicon → যদি ছবি না থাকে, তাহলে জেনারেটেড আইকন
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=100`;
}