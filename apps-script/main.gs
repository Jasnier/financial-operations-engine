// ==============================
// 🔹 ENTRY POINT
// ==============================

function aprobarOperacion(payload) {

  try {

    validarPayload(payload);

    const auth = validarOperador(payload.api_key, payload.libro_origen);
    if (auth.error) throw new Error(auth.error);

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    try {

      const sheet = obtenerHojaMovimientos();
      const data = sheet.getDataRange().getValues();

      validarDuplicados(data, payload);

      const saldoAnterior = obtenerSaldoAnterior(data, payload);

      const contexto = construirContextoFinanciero(payload);

      const resultado = calcularMovimiento(contexto, saldoAnterior);
      if (resultado.error) throw new Error(resultado.error);

      const hashOperacion = generarHashOperacion(payload, resultado, contexto);

      const fila = construirFila(payload, resultado, contexto, hashOperacion);

      sheet.appendRow(fila);

      const respuesta = construirRespuesta(payload, resultado, hashOperacion);

      notificarCliente(payload, respuesta);

      return respuesta;

    } finally {
      lock.releaseLock();
    }

  } catch (error) {
    return { status: "ERROR", message: error.message };
  }
}

---

/* ==============================
   🔹 VALIDACIONES
============================== */

function validarPayload(payload) {

  if (!payload) throw new Error("Payload vacío");

  const camposObligatorios = [
    "api_key",
    "libro_origen",
    "id_registro",
    "id_contraparte",
    "tipo_movimiento",
    "monto_origen",
    "fecha_operacion",
    "hora_operacion",
    "moneda_destino",
    "id_transaccion",
    "modalidad",
    "nombre_contraparte"
  ];

  for (let campo of camposObligatorios) {
    if (!payload[campo]) {
      throw new Error("Campo obligatorio faltante: " + campo);
    }
  }
}

function validarDuplicados(data, payload) {

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_registro) {
      throw new Error("id_registro duplicado");
    }
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === payload.id_transaccion) {
      throw new Error("id_transaccion duplicado");
    }
  }
}

---

/* ==============================
   🔹 DATA ACCESS
============================== */

function obtenerHojaMovimientos() {

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("MOVIMIENTOS");

  if (!sheet) {
    throw new Error("Hoja MOVIMIENTOS no existe");
  }

  return sheet;
}

function obtenerSaldoAnterior(data, payload) {

  for (let i = data.length - 1; i > 0; i--) {
    if (
      data[i][12] === payload.id_contraparte &&
      data[i][15] === payload.moneda_destino
    ) {
      return Number(data[i][21]) || 0;
    }
  }

  return 0;
}

---

/* ==============================
   🔹 CONTEXTO FINANCIERO
============================== */

function construirContextoFinanciero(payload) {

  const tasaCore = obtenerTasaDesdeCore(
    payload.moneda_origen,
    payload.moneda_destino,
    payload.modalidad,
    payload.fecha_hora
  );

  if (tasaCore.error) throw new Error(tasaCore.error);

  const utilidadCore = obtenerUtilidadDesdeCore(
    payload.moneda_origen,
    payload.moneda_destino,
    payload.modalidad,
    payload.fecha_hora
  );

  if (utilidadCore.error) throw new Error(utilidadCore.error);

  const beneficio = obtenerBeneficioDesdeCore(payload);

  payload.tasa_base = tasaCore.tasa;
  payload.idtasa_base = tasaCore.id_tasa;

  payload.utilidad_configurada = utilidadCore.utilidad;
  payload.id_utilidad = utilidadCore.id_utilidad;

  payload.beneficio_contraparte = beneficio.beneficio;
  payload.id_beneficio_contraparte = beneficio.id_beneficio;

  return {
    tasaCore,
    utilidadCore,
    beneficio
  };
}

---

/* ==============================
   🔹 HASH
============================== */

function generarHashOperacion(payload, resultado, contexto) {

  return generarHash({
    id_registro: payload.id_registro,
    id_tasa: contexto.tasaCore.id_tasa,
    tasa: contexto.tasaCore.tasa,
    timestamp: contexto.tasaCore.fechaEvaluada,
    monto: resultado.montoCop,
    saldoPost: resultado.saldoPost
  });
}

---

/* ==============================
   🔹 CONSTRUCCIÓN DE FILA
============================== */

function construirFila(payload, resultado, contexto, hash) {

  const fila = new Array(36).fill("");

  const zona = Session.getScriptTimeZone();

  fila[4] = Utilities.formatDate(new Date(payload.fecha_operacion), zona, "dd/MM/yyyy");
  fila[5] = Utilities.formatDate(new Date(payload.hora_operacion), zona, "HH:mm:ss");

  fila[0] = payload.id_registro;
  fila[1] = new Date();
  fila[2] = payload.id_transaccion;
  fila[3] = payload.tipo_movimiento.toUpperCase();

  fila[6] = payload.libro_origen;
  fila[7] = payload.modalidad;
  fila[8] = payload.recibido_en || "";
  fila[9] = payload.empresa || "";
  fila[10] = payload.tipo_contraparte || "";
  fila[11] = payload.nombre_contraparte;
  fila[12] = payload.id_contraparte;
  fila[13] = payload.tercero || "";
  fila[14] = payload.moneda_origen || "";
  fila[15] = payload.moneda_destino;
  fila[16] = Number(payload.monto_origen);

  fila[17] = resultado.tasaAplicada;
  fila[18] = resultado.montoCop;
  fila[19] = resultado.entrada;
  fila[20] = resultado.salida;
  fila[21] = resultado.saldoPost;

  fila[22] = payload.verificacion;
  fila[23] = payload.fecha_verificacion;

  fila[26] = resultado.tasaadqui;
  fila[27] = resultado.montocompra;
  fila[28] = resultado.utilidad;

  fila[31] = contexto.tasaCore.id_tasa;
  fila[32] = payload.id_beneficio_contraparte;
  fila[33] = payload.descuento_tasa;
  fila[34] = payload.id_utilidad;

  fila[35] = hash;

  return fila;
}

---

/* ==============================
   🔹 RESPUESTA
============================== */

function construirRespuesta(payload, resultado, hash) {

  return {
    status: "OK",
    id_registro: payload.id_registro,
    montoCop: resultado.montoCop,
    entrada: resultado.entrada,
    salida: resultado.saldoPost >= 0 ? resultado.salida : 0,
    saldo_post_movimiento: resultado.saldoPost,
    tasafinal: resultado.tasaAplicada,
    tasadescuento: payload.descuento_tasa,
    hash: hash
  };
}

---

/* ==============================
   🔹 INTEGRACIONES
============================== */

function notificarCliente(payload, respuesta) {

  const CLIENTES_MEGA = {
    "AA-": "YOUR_LINK",
    "BB-": "YOUR_LINK",
    "CC-": "YOUR_LINK",
    "DD-": "YOUR_LINK"
  };

  const id = String(payload.id_registro).trim().toUpperCase();

  let urlDestino = null;

  for (let prefijo in CLIENTES_MEGA) {
    if (id.startsWith(prefijo)) {
      urlDestino = CLIENTES_MEGA[prefijo];
      break;
    }
  }

  if (!urlDestino) return;

  try {

    const response = UrlFetchApp.fetch(urlDestino, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        api_key: "YOUR_API_KEY",
        data: respuesta
      }),
      muteHttpExceptions: true
    });

    Logger.log("RESPUESTA CLIENTE: " + response.getContentText());

  } catch (error) {
    Logger.log("ERROR FETCH CLIENTE: " + error);
  }
}
