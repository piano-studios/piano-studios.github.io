/* ============ VISTA DE OPERADOR (teléfono) ============
   - Ve todas las unidades, pero solo puede hacer el checklist de UNA.
   - Al guardar el checklist (la unidad pasa a operando) queda ligado a esa unidad:
     no ve las demás hasta que la unidad vuelva a inactiva (segundo guardado).
   - Una unidad que opera otro dispositivo aparece bloqueada. */

/* ============ DISPOSITIVO ============ */
// Cada teléfono tiene un identificador propio; así se sabe quién tomó cada unidad
const ID_KEY = "checklist_dispositivo_v1";
function idDispositivo() {
  let id = null;
  try { id = localStorage.getItem(ID_KEY); } catch (err) { /* sin almacenamiento */ }
  if (!id) {
    id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
    try { localStorage.setItem(ID_KEY, id); } catch (err) { /* sin almacenamiento */ }
  }
  return id;
}
const YO = idDispositivo();

/* ============ ESTADO ============ */
const app = document.getElementById("app");
let seleccionId = null; // unidad abierta en pantalla (null = lista)

const unidad = id => machines.find(m => m.id === id);
const miUnidad = () => machines.find(m => m.inicio && m.tomadaPor === YO);
const ocupadaPorOtro = m => !!m.inicio && !!m.tomadaPor && m.tomadaPor !== YO;

// Decide qué pantalla mostrar con lo último guardado
function mostrar() {
  recargar();
  const mia = miUnidad();
  if (mia) seleccionId = mia.id; // ya tomó una unidad: solo ve esa
  else {
    const abierta = unidad(seleccionId);
    if (!abierta || ocupadaPorOtro(abierta)) seleccionId = null;
  }
  if (seleccionId == null) renderLista();
  else renderChecklist(unidad(seleccionId));
}

/* ============ LISTA DE UNIDADES ============ */
function unidadHTML(m) {
  const ocupada = ocupadaPorOtro(m);
  return `<li><button type="button" class="unit-item" data-id="${m.id}" ${ocupada ? "disabled" : ""}>
    <span class="dot ${m.status}"></span>
    <span class="unit-info"><span class="name">${esc(m.name)}</span><span class="sub">${esc(m.tipo)} · ${esc(m.area)}</span></span>
    <span class="badge ${m.status}">${ocupada ? "En operación" : esc(m.label)}</span>
  </button></li>`;
}

function renderLista() {
  app.innerHTML = `
    <header class="topbar"><h1>Unidades</h1></header>
    <p class="hint-top">Elige la unidad que vas a revisar. Al guardar su checklist, solo verás esa unidad hasta que termines.</p>
    ${machines.length ? `<ul class="units">${machines.map(unidadHTML).join("")}</ul>` : `<p class="muted">No hay unidades registradas.</p>`}`;
  window.scrollTo(0, 0);
}

/* ============ CHECKLIST DE UNA UNIDAD ============ */
function topbarHTML(m) {
  const bloqueado = m.inicio && m.tomadaPor === YO;
  return bloqueado
    ? `<span class="tag">Tu unidad en operación</span>`
    : `<button type="button" class="back" data-act="volver">‹ Unidades</button>`;
}

// Encabezado y tarjetas
function topHTML(m) {
  return `
    <div class="detail-head">
      <h1>${esc(m.name)}</h1>
      <span class="badge ${m.status}">${esc(m.label)}</span>
    </div>
    ${m.faltantes.length ? `<div class="aviso">Faltaron por chequear al iniciar: <strong>${m.faltantes.map(esc).join(", ")}</strong></div>` : ""}
    <div class="cards">
      <div class="card"><div class="label">Tipo</div><div class="value">${esc(m.tipo)}</div></div>
      <div class="card"><div class="label">Área</div><div class="value">${esc(m.area)}</div></div>
      <div class="card"><div class="label">Horas de uso</div><div class="value">${m.horas.toLocaleString("es-MX", { maximumFractionDigits: 2 })} h</div></div>
      <div class="card"><div class="label">${m.inicio ? "Operando desde" : "Última revisión"}</div><div class="value">${m.inicio ? formatFecha(m.inicio) : esc(m.revision)}</div></div>
    </div>`;
}

// Barra inferior con el botón de guardar
function barHTML(m) {
  const hint = m.inicio
    ? "Operando. Al guardar se detendrá, se sumarán las horas, el chequeo quedará en blanco y volverás a ver todas las unidades."
    : "Inactiva. Al guardar pasará a operando y solo verás esta unidad hasta que termines.";
  return `<span class="save-hint">${hint}</span>
    <button type="button" class="btn primary" id="btn-guardar">Guardar cambios</button>`;
}

function renderChecklist(m) {
  app.innerHTML = `
    <header class="topbar" id="topbar">${topbarHTML(m)}</header>
    <div id="detail-top">${topHTML(m)}</div>
    <h3>Check list</h3>
    <ul class="checks" id="checks">${checksHTML(m)}</ul>
    <div class="notes">
      <h3>Notas</h3>
      <textarea id="notas" placeholder="Observaciones de la revisión...">${esc(m.notas)}</textarea>
    </div>
    <div class="save-bar" id="save-bar">${barHTML(m)}</div>`;
  window.scrollTo(0, 0);
}

function guardar(m) {
  if (ocupadaPorOtro(m)) { showToast("Unidad ocupada", "La está operando otro dispositivo"); mostrar(); return; }

  const faltantes = m.inicio ? [] : faltantesAlIniciar(m);
  const r = m.guardarCambios(faltantes, YO);

  if (!guardarUnidad(m)) {
    // La unidad ya no existe o no hay espacio: se vuelve a lo último guardado
    showToast("No se pudo guardar", "Revisa que la unidad siga registrada");
    mostrar();
    return;
  }

  const n = faltantes.length;
  showToast("Checklist guardado", r.activa
    ? (n ? `Operando, pero faltaron ${n} elemento${n > 1 ? "s" : ""} por chequear` : "Unidad en operación")
    : `Tiempo trabajado: ${formatDuracion(r.horasTrabajadas)} · chequeo reiniciado`);

  if (r.activa) {
    // Se actualiza lo que cambia (ya no hay botón de volver, cambia la fase) sin tocar las notas
    document.getElementById("topbar").innerHTML = topbarHTML(m);
    document.getElementById("detail-top").innerHTML = topHTML(m);
    document.getElementById("save-bar").innerHTML = barHTML(m);
    document.getElementById("checks").innerHTML = checksHTML(m);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    seleccionId = null;
    mostrar(); // fin de turno: vuelve la lista con todas las unidades
  }
}

/* ============ ELEMENTOS (CHEQUEOS) ============ */
// Las respuestas se guardan solas poco después de cada cambio
let tGuardar = null;
let pendienteId = null;
function guardarPronto(m) {
  pendienteId = m.id;
  clearTimeout(tGuardar);
  tGuardar = setTimeout(vaciarPendiente, 300);
}
function vaciarPendiente() {
  clearTimeout(tGuardar);
  tGuardar = null;
  const m = unidad(pendienteId);
  if (m) guardarUnidad(m);
}
window.addEventListener("beforeunload", () => { if (tGuardar) vaciarPendiente(); });
// En el teléfono, al cambiar de app la página puede cerrarse sin avisar
document.addEventListener("visibilitychange", () => { if (document.hidden && tGuardar) vaciarPendiente(); });

function aplicarZona(sl, p) {
  const z = zonaDe(p);
  sl.style.setProperty("--zona", z.color);
  sl.style.setProperty("--zona-txt", z.texto);
  sl.querySelector(".slider-val").textContent = p + " %";
}

// Reduce la foto para que quepa en localStorage
function reducirImagen(archivo, max = 1024, calidad = 0.7) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", calidad));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Imagen no válida")); };
    img.src = url;
  });
}

function controlHTML(c, i, v) {
  switch (c.tipo) {
    case "slider": {
      const respondido = v !== undefined;
      const p = respondido ? v : 50;
      const z = zonaDe(p);
      const estilo = `--grad:${GRADIENTE}` + (respondido ? `;--zona:${z.color};--zona-txt:${z.texto}` : "");
      const marcas = [0, 25, 50, 75, 100]
        .map(n => `<span style="left:calc(15px + (100% - 30px) * ${n / 100})">${n}%</span>`).join("");
      return `<div class="slider ${respondido ? "answered" : ""}" style="${estilo}">
        <div class="slider-row">
          <input type="range" id="chk-${i}" min="0" max="100" step="1" value="${p}">
          <output class="slider-val">${respondido ? p + " %" : "—"}</output>
        </div>
        <div class="slider-marks">${marcas}</div>
      </div>`;
    }
    case "foto":
      return `<div class="foto">
        <img class="foto-thumb" alt="Foto del chequeo" ${v ? `src="${esc(v)}"` : "hidden"}>
        <input type="file" id="chk-${i}" accept="image/*" hidden>
        <button type="button" class="btn secondary" data-foto>${v ? "Cambiar foto" : "Sube una foto"}</button>
      </div>`;
    case "numero":
      return `<div class="num">
        <input type="number" inputmode="decimal" id="chk-${i}" min="0" step="0.1" placeholder="0.0" value="${esc(v ?? "")}">
        <span class="unit">${esc(c.unidad || "")}</span>
      </div>`;
    case "booleano": {
      const tache = `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
      const tick = `<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
      return `<div class="bool">
        <button type="button" class="bool-btn no ${v === false ? "sel" : ""}" data-bool="0" aria-pressed="${v === false}" title="No" aria-label="No">${tache}</button>
        <button type="button" class="bool-btn si ${v === true ? "sel" : ""}" data-bool="1" aria-pressed="${v === true}" title="Sí" aria-label="Sí">${tick}</button>
      </div>`;
    }
    default:
      return `<input type="checkbox" id="chk-${i}" ${v ? "checked" : ""}>`;
  }
}

function checksHTML(m) {
  // Antes de iniciar se muestran los chequeos "inicio"; con la unidad operando, los de "fin"
  const fase = m.inicio ? "fin" : "inicio";
  return m.checks.map((raw, i) => {
    const c = normalizar(raw);
    if (c.momento && c.momento !== fase) return ""; // no es de esta fase (conserva su posición i)
    const v = m.respuestas[i];
    return `<li data-i="${i}">
      <span class="dot ${estaRespondido(c, v) ? "ok" : "fail"}"></span>
      <label class="chk-name" for="chk-${i}">${esc(c.nombre)}</label>
      <div class="chk-control">${controlHTML(c, i, v)}</div>
    </li>`;
  }).join("");
}

// Se ejecuta cuando el usuario contesta un chequeo
function onChequeo(m, el) {
  const li = el.closest("li[data-i]");
  const i = Number(li.dataset.i);
  const c = normalizar(m.checks[i]);
  const r = m.respuestas;
  const dot = li.querySelector(".dot");
  const marcar = ok => { dot.className = "dot " + (ok ? "ok" : "fail"); };

  if (c.tipo === "slider") {
    const p = Number(el.value);
    r[i] = p;
    const sl = li.querySelector(".slider");
    sl.classList.add("answered");
    aplicarZona(sl, p);
    marcar(true);
    guardarPronto(m);
  } else if (c.tipo === "numero") {
    r[i] = el.value.trim();
    marcar(estaRespondido(c, r[i]));
    guardarPronto(m);
  } else if (c.tipo === "foto") {
    const archivo = el.files[0];
    el.value = "";
    if (!archivo) return;
    const anterior = r[i];
    reducirImagen(archivo)
      .then(url => {
        r[i] = url;
        if (!guardarUnidad(m)) {
          // Sin espacio: se restaura lo anterior para no bloquear los demás guardados
          if (anterior === undefined) delete r[i]; else r[i] = anterior;
          showToast("No se pudo guardar la foto", "Es demasiado grande para el almacenamiento");
          return;
        }
        const img = li.querySelector(".foto-thumb");
        img.src = url;
        img.hidden = false;
        li.querySelector("[data-foto]").textContent = "Cambiar foto";
        marcar(true);
      })
      .catch(() => showToast("No se pudo leer la imagen", "Prueba con otra foto"));
  } else if (c.tipo === "booleano") {
    const valor = el.dataset.bool === "1";
    r[i] = valor;
    li.querySelectorAll("[data-bool]").forEach(b => {
      const activo = (b.dataset.bool === "1") === valor;
      b.classList.toggle("sel", activo);
      b.setAttribute("aria-pressed", activo);
    });
    marcar(true);
    guardarPronto(m);
  } else {
    r[i] = el.checked;
    marcar(el.checked);
    guardarPronto(m);
  }
}

/* ============ EVENTOS (un solo grupo para toda la pantalla) ============ */
app.addEventListener("click", e => {
  if (e.target.closest('[data-act="volver"]')) { seleccionId = null; mostrar(); return; }

  const u = e.target.closest(".unit-item");
  if (u) { if (!u.disabled) { seleccionId = Number(u.dataset.id); mostrar(); } return; }

  const m = unidad(seleccionId);
  if (!m) return;
  if (e.target.closest("#btn-guardar")) { guardar(m); return; }

  const f = e.target.closest("[data-foto]");
  if (f) f.parentElement.querySelector("input[type=file]").click();
  const bo = e.target.closest("[data-bool]");
  if (bo) onChequeo(m, bo);
});

app.addEventListener("input", e => {
  const m = unidad(seleccionId);
  if (!m) return;
  if (["range", "number"].includes(e.target.type)) onChequeo(m, e.target);
  else if (e.target.id === "notas") { m.notas = e.target.value; guardarPronto(m); }
});

app.addEventListener("change", e => {
  const m = unidad(seleccionId);
  if (m && ["checkbox", "file"].includes(e.target.type)) onChequeo(m, e.target);
});

// Si otra pestaña cambia los datos y el operador está en la lista, se actualiza sola
window.addEventListener("storage", e => { if (e.key === STORAGE_KEY && seleccionId == null) mostrar(); });

/* ============ INICIO ============ */
mostrar();
