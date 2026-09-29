export function getLocalStorage(nombre) {
   return localStorage.getItem(nombre)
}
  
export function setLocalStorage(nombre,key) {
    localStorage.setItem(nombre, key);
}
  
export function removeAllLocalStorage() {
    localStorage.clear();
}
  
  