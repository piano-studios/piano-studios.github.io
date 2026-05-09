/* ══════════════════════════   DATOS   ══════════════════════════ */

/*
  NOTES: las 12 notas cromáticas.
  aliases: todas las formas válidas que el usuario puede escribir
  (en minúsculas; la comparación se hace en lowercase).
*/
const NOTES = [
  { en:'C',  es:'Do',   aliases:[
    { text:'c',    display:'C'   },
    { text:'do',   display:'Do'  },
  ]},
  { en:'C#', es:'Do#',  aliases:[
    { text:'c#',   display:'C#'  },
    { text:'db',   display:'Db'  },
    { text:'do#',  display:'Do#' },
    { text:'reb',  display:'Reb' },
  ]},
  { en:'D',  es:'Re',   aliases:[
    { text:'d',    display:'D'   },
    { text:'re',   display:'Re'  },
  ]},
  { en:'D#', es:'Re#',  aliases:[
    { text:'d#',   display:'D#'  },
    { text:'eb',   display:'Eb'  },
    { text:'re#',  display:'Re#' },
    { text:'mib',  display:'Mib' },
  ]},
  { en:'E',  es:'Mi',   aliases:[
    { text:'e',    display:'E'   },
    { text:'mi',   display:'Mi'  },
  ]},
  { en:'F',  es:'Fa',   aliases:[
    { text:'f',    display:'F'   },
    { text:'fa',   display:'Fa'  },
  ]},
  { en:'F#', es:'Fa#',  aliases:[
    { text:'f#',   display:'F#'  },
    { text:'gb',   display:'Gb'  },
    { text:'fa#',  display:'Fa#' },
    { text:'solb', display:'Solb'},
  ]},
  { en:'G',  es:'Sol',  aliases:[
    { text:'g',    display:'G'   },
    { text:'sol',  display:'Sol' },
  ]},
  { en:'G#', es:'Sol#', aliases:[
    { text:'g#',   display:'G#'  },
    { text:'ab',   display:'Ab'  },
    { text:'sol#', display:'Sol#'},
    { text:'lab',  display:'Lab' },
  ]},
  { en:'A',  es:'La',   aliases:[
    { text:'a',    display:'A'   },
    { text:'la',   display:'La'  },
  ]},
  { en:'A#', es:'La#',  aliases:[
    { text:'a#',   display:'A#'  },
    { text:'bb',   display:'Bb'  },
    { text:'la#',  display:'La#' },
    { text:'sib',  display:'Sib' },
  ]},
  { en:'B',  es:'Si',   aliases:[
    { text:'b',    display:'B'   },
    { text:'si',   display:'Si'  },
    { text:'cb',   display:'Cb'  },
    { text:'dob',   display:'Dob'  },
  ]},
];

/*
  CHORD_TYPES: tipos de acordes soportados.
  suffixes: lo que el usuario escribe DESPUÉS de la nota raíz.
  Se prueba case-insensitive; el sufijo vacío '' = Mayor por defecto.
*/
const CHORD_TYPES = [
  { suffixes:['maj','major','mayor',''],
    label:'Major', intervals:[0,4,7],
    formula:'1 – 3 – 5',
    info:'El acorde más común. Sonido brillante y estable. Base de la armonía tonal.' },

  { suffixes:['m','min','minor','menor','-'],
    label:'Minor', intervals:[0,3,7],
    formula:'1 – b3 – 5',
    info:'Sonido más oscuro y emotivo. Muy usado en baladas y música romántica.' },

  { suffixes:['dim','disminuido','°'],
    label:'Diminished', intervals:[0,3,6],
    formula:'1 – b3 – b5',
    info:'Tensión máxima. Ideal como acorde de paso.' },

  { suffixes:['aug','augmented','aumentado','+'],
    label:'Augmented', intervals:[0,4,8],
    formula:'1 – 3 – #5',
    info:'Sonido misterioso e inestable. Muy usado en modulaciones.' },

  { suffixes:['sus2', 'sus 2'],
    label:'Suspended 2', intervals:[0,2,7],
    formula:'1 – 2 – 5',
    info:'Sin tercera, reemplazada por la 2ª. Sonido abierto y moderno.' },

  { suffixes:['add2','add 2'],
    label:'Add 2', intervals:[0,2,4,7],
    formula:'1 – 2 – 3 – 5',
    info:'Cristalino y brillante. El estándar para baladas modernas y sonidos atmosféricos.' },

  { suffixes:['sus4','sus','sus 4'],
    label:'Suspended 4', intervals:[0,5,7],
    formula:'1 – 4 – 5',
    info:'Sin tercera, reemplazada por la 4ª. Crea tensión que pide resolver.' },

  { suffixes:['add4','add 4'],
    label:'Add 4', intervals:[0,4,7,5],
    formula:'1 – 3 – 5 – 4',
    info:'Mayor con la añadida 4ª. Fresco y expansivo. Ideal para dar textura al folk y al pop acústico..' },



  { suffixes:['maj7','Δ7','Δ','mayor7'],
    label:'Major 7', intervals:[0,4,7,11],
    formula:'1 – 3 – 5 – 7',
    info:'Rico y suave. Muy usado en jazz y bossa nova.' },

  { suffixes:['m7','min7','menor7','minor7'],
    label:'Minor 7', intervals:[0,3,7,10],
    formula:'1 – b3 – 5 – b7',
    info:'Cálido y melancólico. Base del jazz moderno y el funk.' },

  { suffixes:['7','dom7'],
    label:'Dominant 7', intervals:[0,4,7,10],
    formula:'1 – 3 – 5 – b7',
    info:'Tensión que resuelve a la tónica. Esencial en blues y jazz.' },

  { suffixes:['dim7','°7'],
    label:'Diminished 7', intervals:[0,3,6,9],
    formula:'1 – b3 – b5 – bb7',
    info:'Muy tenso y simétrico. Se transpone igual cada 3 semitonos.' },

  { suffixes:['m7b5','ø','ø7','m7(b5)','m7 b5','0','ø 7','07','0 7','m7 (b5)','half dim','halfdim','half dim7','halfdim7'],
    label:'half diminished', intervals:[0,3,6,10],
    formula:'1 – b3 – b5 – b7',
    info:'También llamado "semi disminuido". Muy común en jazz.' },

  { suffixes:['maj9','M9','Δ9','maj7(9)','maj7 (9)','mayor9','mayor 9'],
    label:'Major 9', intervals:[0,4,7,11,14],
    formula:'1 – 3 – 5 – 7 – 9',
    info:'Extensión del maj7. Colorido y complejo, popular en jazz moderno.' },

  { suffixes:['m9','min9','menor9','minor9'],
    label:'Minor 9', intervals:[0,3,7,10,14],
    formula:'1 – b3 – 5 – b7 – 9',
    info:'Sofisticado y expresivo. Muy usado en R&B y neo-soul.' },

  { suffixes:['9','dom9','dom 9','7(9)','7 (9)'],
    label:'Dominant 9', intervals:[0,4,7,10,14],
    formula:'1 – 3 – 5 – b7 – 9',
    info:'Expansión del dominante. Muy común en funk y jazz.' },

  { suffixes:['add9','add 9'],
    label:'Add 9', intervals:[0,4,7,14],
    formula:'1 – 3 – 5 – 9',
    info:'Mayor con la 9ª, sin la 7ª. Sonido fresco, popular en pop y rock.' },

  { suffixes:['6','maj6'],
    label:'Major 6', intervals:[0,4,7,9],
    formula:'1 – 3 – 5 – 6',
    info:'Alternativa dulce al maj7. Muy común en jazz clásico y bossa nova.' },

  { suffixes:['m6','min6'],
    label:'Minor 6', intervals:[0,3,7,9],
    formula:'1 – b3 – 5 – 6',
    info:'Característico del jazz latino y la bossa nova. Sonido agridulce.' },
];

/*
  IMPORTANTE: hay conflicto entre el sufijo 'm' (menor) y la inicial de
  notas en español como "Mi" o "Fa". El parser resuelve esto dando
  prioridad a los aliases más largos, entonces "mi" completo se reconoce
  como nota, y solo lo que queda después se interpreta como sufijo.

  También existe conflicto entre el sufijo vacío '' (mayor) y el sufijo 'm'
  que puede venir de "maj". Para resolverlo, el parser ordena los tipos
  por longitud del sufijo de mayor a menor, probando primero los más
  específicos (ej. "maj7" antes que "maj" antes que "m" antes que "").
*/

/* ══════════════════════════ PARSER ══════════════════════════ */
 
function noteIndex(semi) {
  return ((semi % 12) + 12) % 12;
}
 
/*
  parseChord(raw):
  1. Busca qué nota inicia el texto (alias más largo primero).
  2. El texto restante es el "sufijo" del tipo de acorde.
  3. Busca qué tipo de acorde coincide con el sufijo (sufijo más largo primero).
  Devuelve { rootIdx, type } o null si no reconoce.
*/
function parseChord(raw) {
  const input = raw.trim();
  if (!input) return null;
 
  // Construir lista de aliases ordenada de mayor a menor longitud
  // Ahora cada alias es un objeto { text, display } en lugar de un string
  const aliasesByLen = [];
  NOTES.forEach((note, idx) => {
    note.aliases.forEach(alias => aliasesByLen.push({ alias, idx }));
  });
  aliasesByLen.sort((a, b) => b.alias.text.length - a.alias.text.length);
 
  const inputLower = input.toLowerCase();
  let rootIdx     = -1;
  let rootDisplay = '';   // ← nombre a mostrar (preserva enharmonía)
  let remainder   = '';
 
  for (const { alias, idx } of aliasesByLen) {
    if (inputLower.startsWith(alias.text)) {
      rootIdx     = idx;
      rootDisplay = alias.display;  // ← guardamos el nombre exacto del alias
      remainder   = input.slice(alias.text.length).trim();
      break;
    }
  }
  if (rootIdx === -1) return null;
 
  // Construir lista de sufijos de tipos, ordenada de mayor a menor longitud
  // (para que "maj7" se pruebe antes que "maj" y antes que "m")
  const suffixesByLen = [];
  CHORD_TYPES.forEach(type => {
    type.suffixes.forEach(s => suffixesByLen.push({ s, type }));
  });
  suffixesByLen.sort((a, b) => b.s.length - a.s.length);
 
  const remLower = remainder.toLowerCase();
 
  for (const { s, type } of suffixesByLen) {
    if (s.toLowerCase() === remLower) {
      return { rootIdx, rootDisplay, type };  // ← devolvemos rootDisplay
    }
  }
 
  return null;
}
 
/* ══════════════════════════ TECLADO ══════════════════════════ */
 
// Semitonos de las teclas blancas dentro de una octava
const WHITE_SEMI = [0, 2, 4, 5, 7, 9, 11];
const KEY_W = 40;  // ancho tecla blanca
const KEY_BW = 26; // ancho tecla negra
 
function renderPiano(rootIdx, intervals) {
  const piano    = document.getElementById('piano');
  const labelRow = document.getElementById('label-row');
  piano.innerHTML = '';
  labelRow.innerHTML = '';
 
  // Conjunto de notas del acorde (0-11)
  const chordNotes = new Set(intervals.map(i => noteIndex(rootIdx + i)));
 
  const START_OCT = 3;
  const OCTAVES   = 2;
 
  // Lista de teclas blancas con su semitono absoluto y nota relativa
  const whites = [];
  for (let oct = 0; oct < OCTAVES; oct++) {
    WHITE_SEMI.forEach((ws, wi) => {
      const semi = START_OCT * 12 + oct * 12 + ws;
      whites.push({ semi, ni: noteIndex(semi), oct: START_OCT + oct, wIdx: oct * 7 + wi });
    });
  }
 
  whites.forEach(({ semi, ni, oct, wIdx }, i) => {
    const isChord = chordNotes.has(ni);
    const isRoot  = ni === noteIndex(rootIdx);
 
    // Tecla blanca
    const wk = document.createElement('div');
    wk.className = 'key-white' + (isRoot ? ' root-key' : isChord ? ' lit' : '');
    piano.appendChild(wk);
 
    // Etiqueta (solo C de cada octava)
    const lbl = document.createElement('div');
    lbl.className = 'key-label';
    lbl.textContent = ni === 0 ? `C${oct}` : '';
    labelRow.appendChild(lbl);
 
    // Tecla negra (si hay semitono entre esta blanca y la siguiente)
    if (i < whites.length - 1 && whites[i + 1].semi - semi === 2) {
      const bNi     = noteIndex(semi + 1);
      const bIsChord = chordNotes.has(bNi);
      const bIsRoot  = bNi === noteIndex(rootIdx);
 
      const bk = document.createElement('div');
      bk.className = 'key-black' + (bIsRoot ? ' root-key' : bIsChord ? ' lit' : '');
      // Centrada entre las dos blancas adyacentes
      bk.style.left = (wIdx * KEY_W + KEY_W - KEY_BW / 2) + 'px';
      piano.appendChild(bk);
    }
  });
}
 
/* ══════════════════════════ MOSTRAR RESULTADO ══════════════════════════ */
 
function showResult(rootIdx, rootDisplay, type) {
 
  // Nombre y fórmula
  // Usamos rootDisplay (el nombre exacto que escribió el usuario)
  // para respetar la enharmonía: Db en lugar de C#, Bb en lugar de A#, etc.
  document.getElementById('disp-name').innerHTML =
    `<em>${rootDisplay}</em> ${type.label}`;
  document.getElementById('disp-formula').textContent =
    'Fórmula: ' + type.formula;
  document.getElementById('disp-desc').textContent = type.info;
 
  // Pastillas de notas
  const sec = document.getElementById('disp-notes');
  sec.innerHTML = '<span class="notes-label">Notas</span>';
  type.intervals.forEach((interval, i) => {
    const note = NOTES[noteIndex(rootIdx + interval)];
    const pill = document.createElement('div');
    pill.className = 'note-pill' + (i === 0 ? ' is-root' : '');
    pill.innerHTML = `${note.en} <small>${note.es}</small>`;
    sec.appendChild(pill);
  });
 
  // Piano
  renderPiano(rootIdx, type.intervals);
 
  // Mostrar panel con animación
  const panel = document.getElementById('result-panel');
  panel.style.display = 'block';
  panel.style.animation = 'none';
  panel.offsetHeight; // reflow para re-disparar animación
  panel.style.animation = '';
 
  document.getElementById('error-msg').style.display = 'none';
}
 
/* ══════════════════════════ HISTORIAL ══════════════════════════ */
 
let history = [];
 
function addToHistory(q) {
  if (history.includes(q)) return;
  history.unshift(q);
  if (history.length > 12) history.pop();
 
  const wrap = document.getElementById('history-wrap');
  const list = document.getElementById('history-list');
  wrap.style.display = 'block';
  list.innerHTML = '';
  history.forEach(item => {
    const tag = document.createElement('div');
    tag.className = 'history-tag';
    tag.textContent = item;
    tag.onclick = () => {
      document.getElementById('chord-input').value = item;
      search();
    };
    list.appendChild(tag);
  });
}
 
/* ══════════════════════════ BÚSQUEDA PRINCIPAL ══════════════════════════ */
 
function search() {
  const raw    = document.getElementById('chord-input').value;
  const result = parseChord(raw);
  const errEl  = document.getElementById('error-msg');
 
  if (!result) {
    errEl.innerHTML =
      `No reconocí el acorde <strong>"${raw}"</strong>.<br>
       Prueba con: <em>C, Cm, Cmaj7, Bb, F#m, Sol, Lam, Do#dim, Fa#m7…</em>`;
    errEl.style.display = 'block';
    document.getElementById('result-panel').style.display = 'none';
    return;
  }
 
  showResult(result.rootIdx, result.rootDisplay, result.type);
  addToHistory(raw.trim());
}
 
/* ══════════════════════════ EVENTOS ══════════════════════════ */
 
document.getElementById('search-btn').addEventListener('click', search);
 
document.getElementById('chord-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') search();
});
 
document.querySelectorAll('.hint-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    document.getElementById('chord-input').value = tag.dataset.q;
    search();
  });
});
 
// Cargar un ejemplo al abrir
document.getElementById('chord-input').value = 'Cmaj7';
search();