export default function searchElement(id, array) {
  return array.find(array => array.id === Number(id));
}
