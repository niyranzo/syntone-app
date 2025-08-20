/**
 * Función para descargar archivos directamente sin navegación
 * @param {string} url - URL completa del archivo a descargar
 * @param {string} filename - Nombre que tendrá el archivo descargado
 * @returns {void}
 */
export const downloadFile = (url, filename) => {  
  // Crear un iframe oculto para manejar la descarga sin navegación
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // Usar XMLHttpRequest para obtener el archivo como blob
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  
  xhr.onload = function() {
    if (this.status === 200) {
      // Crear URL del blob y enlace para descarga
      const blob = new Blob([this.response], { type: xhr.getResponseHeader('content-type') });
      const blobUrl = URL.createObjectURL(blob);
      
      // Usar el iframe para la descarga
      iframe.src = blobUrl;
      
      // También crear un enlace como respaldo
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.click();
      
      // Limpiar recursos después de un breve retraso
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(iframe);
      }, 100);
    } else {
      console.error('Error al descargar:', this.status, this.statusText);
    }
  };
  
  xhr.onerror = function() {
    console.error('Error de red al intentar descargar el archivo');
  };
  
  xhr.send();
};

/**
 * Extrae el nombre de archivo de una ruta
 * @param {string} path - Ruta completa del archivo
 * @returns {string} - Nombre del archivo extraído
 */
export const extractFilename = (path) => {
  if (!path) return '';
  return path.split('/').pop();
};

/**
 * Construye una URL completa para la API
 * @param {string} baseUrl - URL base de la API
 * @param {string} path - Ruta del recurso
 * @returns {string} - URL completa
 */
export const buildApiUrl = (baseUrl, path) => {
  // Si la ruta ya es una URL completa, devolverla tal cual
  if (path && path.startsWith('http')) {
    return path;
  }
  
  // Asegurarse de que hay una barra diagonal entre baseUrl y path
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path?.startsWith('/') ? path.substring(1) : path;
  
  return `${normalizedBase}${normalizedPath}`;
};