// @flow

function loadFile(file): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => { resolve(fileReader.result); };
    fileReader.onerror = (e) => { reject(e); };
    fileReader.readAsText(file);
  });
}


export default async function isJsonFile(file: File): Promise<boolean> {
  let result = false;
  try {
    const text = await loadFile(file);
    JSON.parse(text);
    result = true;
  } catch (e) {
    result = false;
  }
  return result;
}
