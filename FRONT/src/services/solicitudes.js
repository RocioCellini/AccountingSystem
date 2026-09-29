import { post, get } from '../api';

export async function getSolicitudes() {
  const response = await get('/solicitudes/get-all');
  return response;
}

export async function getSolicitud(id) {
  const response = await get('/solicitudes/get-one/' + id);
  return response;
}

export async function marcarComoLeido(id) {
  const response = await post('/marcar-leido',{id:id});
  return response;
}
