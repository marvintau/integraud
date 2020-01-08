
export async function get(url=''){
    const resp = await fetch(url);
    const json = await resp.json();
    return json;
}

export async function post(url = '', data = {}) {
    // Default options are marked with *

    const fetchOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type':'application/json'},
        referrer: 'no-referrer',
      }

    let options = Object.assign({}, fetchOptions, {body: JSON.stringify(data)});
    const resp = await fetch(url, options);
    const json = await resp.json();
    return json;
}

export async function postForm(url = '', data = new FormData()) {

    const fetchOptions = {
        method: 'POST',
        cache: 'no-cache',
        referrer: 'no-referrer',
      }

    let options = Object.assign({}, fetchOptions, {body:data});
    const resp = await fetch(url, options);
    const json = await resp.json();
    return json;
}

export async function postFetchDownload(url = '', data = {}) {
  // Default options are marked with *

  const fetchOptions = {
      method: 'POST',
      cache: 'no-cache',
      headers: {'Content-Type':'application/json'},
      referrer: 'no-referrer',
    }

  let options = Object.assign({}, fetchOptions, {body: JSON.stringify(data)});
  const resp = await fetch(url, options);
  console.log(resp, 'resptype');
  const blob = await resp.blob();
  console.log(blob, 'blob');
  return blob;
}
