import crypto from 'crypto';
 
function getGravatarUrl(email, size = 80) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
 
// Example usage
const email = 'mango@example.com';
const size = 200; 
const gravatarUrl = getGravatarUrl(email, size);
 
console.log('Gravatar URL:', gravatarUrl);