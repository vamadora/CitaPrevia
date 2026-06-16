const zonaURL = {
  sur: "https://outlook.office.com/book/CitaPreviaServiciosSocialesSIVO@sanfernando.es/s/MUR6bcYg_ke4YWv2Bd_BAQ2?ismsaljsauthenabled",
  centro: "https://outlook.office.com/book/CitaPreviaServiciosSocialesSIVO@sanfernando.es/s/bRvOgLQp00apBdVAHwB9_Q2?ismsaljsauthenabled",
  norte: "https://outlook.office.com/book/CitaPreviaServiciosSocialesSIVO@sanfernando.es/s/KUfhqj3TWUmgXOItAOhpSA2?ismsaljsauthenabled"
};

const select = document.getElementById("calle");
const status = document.getElementById("status");
let callesZona = {};

async function cargarCalles() {
  try {
    const response = await fetch("callejero.txt");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    callesZona = parseCalles(text);
    llenarSelect();
  } catch (error) {
    console.error("Error cargando calles:", error);
    status.textContent = "No se han cargado las calles. Abre esta página con un servidor local o comprueba que callejero.txt existe.";
  }
}

function parseCalles(text) {
  const rows = text.split("\n").slice(1);
  return rows.reduce((map, row) => {
    if (!row.trim()) return map;
    
    // Parsear CSV simple
    const partes = row.match(/("([^"]*)"|[^,]+)/g);
    if (!partes || partes.length < 5) return map;
    
    // Remover comillas y espacios
    const nombre = partes[0].replace(/^"|"$/g, '').trim();
    const tipoVia = partes[1].replace(/^"|"$/g, '').trim();
    const zona = partes[4].replace(/^"|"$/g, '').trim().toLowerCase();
    
    if (nombre) map[nombre] = { zona, tipoVia };
    return map;
  }, {});
}

function llenarSelect() {
  select.innerHTML = '<option value="">-- Elige tu calle --</option>';
  Object.keys(callesZona).forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = `${nombre} (${callesZona[nombre].tipoVia})`;
    select.appendChild(option);
  });

  select.disabled = false;
  status.textContent = select.options.length <= 1 ? "No se han encontrado calles en callejero.txt." : "";
}

select.addEventListener("change", () => {
  const calleData = callesZona[select.value];
  if (calleData && zonaURL[calleData.zona]) {
    window.location.href = zonaURL[calleData.zona];
  }
});

cargarCalles();
