export const formatNumber = (number: any) => {
  let value;
  if (number !== undefined && +number > 0) {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
    value = formatter.format(+number);
  } else {
    value = `0`;
  }

  return value;
};

export const floored_val = (val: number, digits: number) => {
  const power = Math.pow(10, digits);
  return +(Math.floor(val * power) / power).toFixed(digits);
}

export const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};


export const separatedArray = (array: any, itemsPerArray: number) => {
  const separatedArrays = [];
  for (let i = 0; i < array.length; i += itemsPerArray) {
    const separatedArray = array.slice(i, i + itemsPerArray);
    separatedArrays.push(separatedArray);
  }
  return separatedArrays;
}

export const generateRandomPrices = ({
  minPrice,
  maxPrice,
  count,
  desiredVolume,
  numDecimalDigits,
}: {
  minPrice: number;
  maxPrice: number;
  count: number;
  desiredVolume: number;
  numDecimalDigits: number;
}) => {
  const prices = [];
  let totalVolume = desiredVolume;

  for (let i = 0; i < count - 1; i++) {
    let volume = Math.floor(Math.random() * totalVolume);
    const price = floored_val(
      Math.random() * (+maxPrice - (+minPrice)) + +minPrice,
      numDecimalDigits,
    );
    while (volume * price < 10) {
      volume = Math.floor(Math.random() * totalVolume);
    }
    prices.push({ volume, price });
    totalVolume -= volume;
  }

  if (totalVolume > 0) {
    const price = floored_val(
      Math.random() * (+maxPrice - (+minPrice)) + +minPrice,
      numDecimalDigits,
    );
    prices.push({ volume: totalVolume, price });
  }

  return prices;
}
