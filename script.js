/* Color Mix for CS50
   Main features: color mixing, HEX/RGB conversion, palette generation, and clipboard copying.
   AI assistance was used during development; review and adapt this code so you can explain it. */

const colorA = document.querySelector("#colorA");
const colorB = document.querySelector("#colorB");
const hexA = document.querySelector("#hexA");
const hexB = document.querySelector("#hexB");
const mixRatio = document.querySelector("#mixRatio");
const ratioValue = document.querySelector("#ratioValue");
const resultSwatch = document.querySelector("#resultSwatch");
const resultHex = document.querySelector("#resultHex");
const resultRgb = document.querySelector("#resultRgb");
const resultName = document.querySelector("#resultName");
const statusMessage = document.querySelector("#statusMessage");
const paletteGrid = document.querySelector("#paletteGrid");

const knownColors = {
  "#a51c30": "Harvard Crimson",
  "#f2c6a0": "Soft Apricot",
  "#d65a4a": "Persimmon",
  "#e9dcc9": "Linen",
  "#273b35": "Forest",
  "#ffffff": "White",
  "#000000": "Black",
  "#6495ed": "Cornflower Blue",
  "#6f8f72": "Sage",
  "#f4c542": "Marigold",
  "#6b5b95": "Iris",
  "#e7a9a1": "Dusty Rose",
  "#7c9eb2": "Slate Blue"
};

const paletteNames = [
  ["Crimson", "Persimmon", "Apricot", "Linen", "Forest"],
  ["Ink", "Slate Blue", "Cloud", "Sage", "Moss"],
  ["Berry", "Dusty Rose", "Blush", "Sand", "Plum"],
  ["Midnight", "Cornflower", "Ice", "Marigold", "Cocoa"]
];

function normalizeHex(value) {
  let hex = value.trim();
  if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = "#" + [...hex.slice(1)].map(char => char + char).join("");
  }
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : null;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b]
    .map(value => Math.round(value).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function mixColors(firstHex, secondHex, firstPercent) {
  const first = hexToRgb(firstHex);
  const second = hexToRgb(secondHex);
  const weight = firstPercent / 100;
  return {
    r: first.r * weight + second.r * (1 - weight),
    g: first.g * weight + second.g * (1 - weight),
    b: first.b * weight + second.b * (1 - weight)
  };
}

function colorName(hex) {
  const normalized = hex.toLowerCase();
  if (knownColors[normalized]) return knownColors[normalized];
  const rgb = hexToRgb(hex);
  const average = (rgb.r + rgb.g + rgb.b) / 3;
  if (average < 55) return "Deep Shade";
  if (average > 220) return "Light Tint";
  if (rgb.r > rgb.g * 1.25 && rgb.r > rgb.b * 1.2) return "Warm Red";
  if (rgb.g > rgb.r * 1.15 && rgb.g > rgb.b * 1.05) return "Fresh Green";
  if (rgb.b > rgb.r * 1.15 && rgb.b > rgb.g * 1.05) return "Cool Blue";
  if (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b) < 25) return "Soft Neutral";
  return "Balanced Tone";
}

function updateMixer() {
  const firstHex = normalizeHex(hexA.value);
  const secondHex = normalizeHex(hexB.value);

  if (!firstHex || !secondHex) {
    statusMessage.textContent = "Enter a valid HEX color, for example #A51C30.";
    return;
  }

  statusMessage.textContent = "";
  colorA.value = firstHex;
  colorB.value = secondHex;
  hexA.value = firstHex;
  hexB.value = secondHex;

  document.querySelector("#dotA").style.background = firstHex;
  document.querySelector("#dotB").style.background = secondHex;
  document.querySelector("#nameA").textContent = colorName(firstHex);
  document.querySelector("#nameB").textContent = colorName(secondHex);

  const percentage = Number(mixRatio.value);
  ratioValue.textContent = `${percentage} / ${100 - percentage}`;

  const mixedRgb = mixColors(firstHex, secondHex, percentage);
  const mixedHex = rgbToHex(mixedRgb);
  resultSwatch.style.backgroundColor = mixedHex;
  resultHex.textContent = mixedHex;
  resultRgb.textContent = `${Math.round(mixedRgb.r)}, ${Math.round(mixedRgb.g)}, ${Math.round(mixedRgb.b)}`;
  resultName.textContent = colorName(mixedHex);
}

function setColor(which, value) {
  const hex = normalizeHex(value);
  if (!hex) return;
  if (which === "A") {
    colorA.value = hex;
    hexA.value = hex;
  } else {
    colorB.value = hex;
    hexB.value = hex;
  }
  updateMixer();
}

colorA.addEventListener("input", () => setColor("A", colorA.value));
colorB.addEventListener("input", () => setColor("B", colorB.value));
hexA.addEventListener("change", () => {
  if (!normalizeHex(hexA.value)) statusMessage.textContent = "Invalid HEX. Try a value like #A51C30.";
  else setColor("A", hexA.value);
});
hexB.addEventListener("change", () => {
  if (!normalizeHex(hexB.value)) statusMessage.textContent = "Invalid HEX. Try a value like #F2C6A0.";
  else setColor("B", hexB.value);
});
mixRatio.addEventListener("input", updateMixer);

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    const value = target.textContent.trim();
    try {
      await navigator.clipboard.writeText(value);
      statusMessage.textContent = `${value} copied to clipboard.`;
    } catch {
      statusMessage.textContent = `Copy not available here. Select and copy: ${value}`;
    }
  });
});

document.querySelector("#randomMix").addEventListener("click", () => {
  const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase();
  setColor("A", randomHex());
  setColor("B", randomHex());
  mixRatio.value = Math.floor(Math.random() * 101);
  updateMixer();
  statusMessage.textContent = "A new combination, just for you.";
});

const paletteSets = [
  ["#A51C30", "#D65A4A", "#F2C6A0", "#E9DCC9", "#273B35"],
  ["#1E293B", "#7C9EB2", "#E9F0F2", "#6F8F72", "#344E41"],
  ["#6B3157", "#E7A9A1", "#F7DDE2", "#D9C3A5", "#4B2E2B"],
  ["#25324A", "#6495ED", "#E4EEF5", "#F4C542", "#8D654A"],
  ["#B04A3A", "#E8A87C", "#F8E9D2", "#A8B5A0", "#394A3F"],
  ["#553D67", "#9B72AA", "#E3D7E8", "#E4B363", "#4A5859"]
];

function renderPalette(colors, names = []) {
  paletteGrid.innerHTML = "";
  colors.forEach((color, index) => {
    const button = document.createElement("button");
    button.className = "palette-color";
    button.dataset.color = color;
    button.setAttribute("aria-label", `Use ${color} in the mixer`);
    const fill = document.createElement("span");
    fill.className = "palette-fill";
    fill.style.setProperty("--swatch", color);
    const meta = document.createElement("span");
    meta.className = "palette-meta";
    const name = document.createElement("b");
    name.textContent = names[index] || colorName(color);
    const code = document.createElement("small");
    code.textContent = color;
    meta.append(name, code);
    const icon = document.createElement("span");
    icon.className = "copy-icon";
    icon.textContent = "↗";
    button.append(fill, meta, icon);
    button.addEventListener("click", async event => {
      if (event.shiftKey) {
        try {
          await navigator.clipboard.writeText(color);
          statusMessage.textContent = `${color} copied to clipboard.`;
        } catch {
          statusMessage.textContent = `HEX value: ${color}`;
        }
      } else {
        setColor("A", color);
        statusMessage.textContent = `${color} loaded as Color One. Shift-click a palette shade to copy its HEX.`;
      }
    });
    paletteGrid.appendChild(button);
  });
}

document.querySelector("#generatePalette").addEventListener("click", () => {
  const available = paletteSets.filter(set => set.join(",") !== [...paletteGrid.querySelectorAll("[data-color]")].map(item => item.dataset.color).join(","));
  const colors = available[Math.floor(Math.random() * available.length)] || paletteSets[0];
  const names = paletteNames[Math.floor(Math.random() * paletteNames.length)];
  renderPalette(colors, names);
});

updateMixer();
