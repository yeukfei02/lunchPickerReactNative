
export const getRootUrl = () => {
  let ROOT_URL = '';
  if (process.env.NODE_ENV === 'development') {
    ROOT_URL = "http://192.168.1.100:3000/api";
  } else {
    ROOT_URL = "https://lunch-picker-api.herokuapp.com/api";
  }

  return ROOT_URL;
}

export const log = (message, item) => {
  console.log(message, item);
}
