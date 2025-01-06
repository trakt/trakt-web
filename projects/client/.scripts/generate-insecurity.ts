/**
 * DOCS: https://docs.deno.com/examples/aes_encryption/
 */
export async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

async function toBase64(key: CryptoKey) {
  const exported = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

if (import.meta.main) {
  const key = await generateKey();
  const base64Key = await toBase64(key);
  console.log(`export TRAKT_SESSION_SECRET='${base64Key}'`);
}
