const fromHex = (hex: string) => {
  return decodeURIComponent('%' + hex.match(/.{1,2}/g)?.join('%'));
};

export default fromHex;
