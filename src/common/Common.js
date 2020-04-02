
export const getRootUrl = () => {
  let ROOT_URL = '';
  if (window.location.href.includes('localhost')) {
    ROOT_URL = "http://localhost:3000/api";
  } else {
    ROOT_URL = "https://lunch-picker-api.herokuapp.com/api";
  }

  return ROOT_URL;
}

export const log = (message, item) => {
  console.log(message, item);
}
