require('es6-promise').polyfill();
require('isomorphic-fetch');


export function fetchData(url) {
  return fetch(url, { credentials: 'same-origin' })
}

// async fetch
export async function asyncFetchData(dispatch, url, action) {
    let res = await fetchData(url)
      .catch(err => console.log('fetch error'));

    let data = await res.json()
      .catch(err => console.log('json error'));
    dispatch(action(data));      
}
