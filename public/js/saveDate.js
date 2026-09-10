document.getElementById('btn-google-calendar').addEventListener('click', function() {
  // Configuración de los datos del evento
  const titulo = encodeURIComponent("Nuestra Boda - Dulce & Gustavo");
  const detalles = encodeURIComponent("¡Te esperamos para celebrar nuestro gran día con nosotros!");
  const ubicacion = encodeURIComponent("San Marcos Tecomaxusco, Estado de México");
  
  // Fechas en UTC (Formato: AAAAMMDDTHHmmSSZ)
  const fechaInicio = "20261128T190000Z";
  const fechaFin = "20261129T180000Z";

  const googleCalendarUrl = `https://calendar.google.com/render?action=TEMPLATE&text=${titulo}&dates=${fechaInicio}/${fechaFin}&details=${detalles}&location=${ubicacion}`;

  window.open(googleCalendarUrl, '_blank');
});