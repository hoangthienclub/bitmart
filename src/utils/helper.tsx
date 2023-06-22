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