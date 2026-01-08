/**
 * CENTROID // OVERDRIVE v1.0
 */

// --- BOOT SEQUENCE ---
document.addEventListener("DOMContentLoaded", () => {
    const BOOT_DURATION = 3500;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
    const targetElement = document.getElementById("decrypt-target");
    const originalText = targetElement.dataset.value; 
    
    let iterations = 0;
    const interval = setInterval(() => {
        targetElement.innerText = originalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) return originalText[index];
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");
        if (iterations >= originalText.length) clearInterval(interval);
        iterations += 1 / 3; 
    }, 50); 

    const bootScreen = document.getElementById('boot-screen');
    const body = document.body;
    setTimeout(() => {
        bootScreen.classList.add('fade-out');
        body.classList.remove('locked');
        typeEffect(); 
    }, BOOT_DURATION);
});

// --- CONFIG ---
const API_URL = "https://centroid-backend.onrender.com/analyze"; 
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const slider = document.getElementById('color-slider');
const exportBtn = document.getElementById('btn-export');
const codeBtn = document.getElementById('btn-code');
const previewImg = document.getElementById('preview-img');
const uploadText = document.querySelector('.upload-content');
const resultsArea = document.getElementById('results-area');
const paletteGrid = document.getElementById('palette-grid');
const loader = document.getElementById('loader');
const densityVal = document.getElementById('density-val');
const textElement = document.getElementById('dynamic-text');

let currentFile = null; 

// --- LISTENERS ---
slider.addEventListener('input', (e) => { densityVal.innerText = e.target.value; });
slider.addEventListener('change', () => { if (currentFile) uploadAndAnalyze(currentFile); });
exportBtn.addEventListener('click', exportPaletteAsPNG);
codeBtn.addEventListener('click', exportThemeCode);
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => { if (e.target.files.length > 0) handleFile(e.target.files[0]); });

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = '#ccff00'; dropZone.style.transform = 'scale(1.02)'; });
dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = '#333'; dropZone.style.transform = 'scale(1)'; });
dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.style.borderColor = '#333'; dropZone.style.transform = 'scale(1)'; if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });

// --- LOGIC ---
function handleFile(file) {
    if(!file.type.startsWith('image/')) { alert("INVALID_FILE_TYPE // SYSTEM_REJECT"); return; }
    currentFile = file; 
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.classList.remove('hidden');
        uploadText.style.opacity = '0'; 
    };
    reader.readAsDataURL(file);
    uploadAndAnalyze(file);
}

async function uploadAndAnalyze(file) {
    resultsArea.classList.remove('hidden');
    loader.classList.remove('hidden');
    paletteGrid.innerHTML = '';
    exportBtn.classList.add('disabled'); exportBtn.disabled = true;
    codeBtn.classList.add('disabled'); codeBtn.disabled = true;
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_colors', slider.value); 

    try {
        const response = await fetch(API_URL, { method: 'POST', body: formData });
        const data = await response.json();
        loader.classList.add('hidden');
        renderDataCards(data.palette);
        exportBtn.classList.remove('disabled'); exportBtn.disabled = false;
        codeBtn.classList.remove('disabled'); codeBtn.disabled = false;
    } catch (err) {
        console.error(err);
        document.querySelector('.loading-text').innerText = "SYSTEM_ERROR // CONNECTION_LOST";
        document.querySelector('.loading-text').style.color = "red";
    }
}

function getLuminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function checkContrast(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const lum = getLuminance(r, g, b);
    const ratioWhite = (1.05) / (lum + 0.05);
    const ratioBlack = (lum + 0.05) / (0.05);
    const bestText = ratioBlack > ratioWhite ? "BLACK" : "WHITE";
    const passed = Math.max(ratioBlack, ratioWhite) >= 4.5;
    return { bestText, passed };
}

function renderDataCards(colors) {
    paletteGrid.innerHTML = '';
    paletteGrid.dataset.colors = JSON.stringify(colors);
    colors.forEach((c, index) => {
        const wcag = checkContrast(c.hex);
        const card = document.createElement('div');
        card.className = 'data-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.animation = `slideUpCard 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards ${index * 0.1}s`;

        card.innerHTML = `
            <div class="color-preview" style="background-color: ${c.hex}">
                <div class="wcag-badge">
                    <span class="wcag-dot ${wcag.passed ? 'pass' : 'fail'}"></span>
                    ${wcag.passed ? 'WCAG: AA' : 'WCAG: FAIL'}
                </div>
            </div>
            <div class="card-info">
                <div class="hex-code">${c.hex.toUpperCase()}</div>
                <div class="perc-label"><span>${c.percentage}%</span><span style="font-size: 0.65rem; opacity:0.7">USE ${wcag.bestText} TEXT</span></div>
            </div>
        `;
        card.onclick = () => {
            navigator.clipboard.writeText(c.hex);
            const hexEl = card.querySelector('.hex-code');
            const original = hexEl.innerText;
            hexEl.innerText = "COPIED"; hexEl.style.color = "#fff";
            setTimeout(() => { hexEl.innerText = original; hexEl.style.color = "#ccff00"; }, 800);
        };
        paletteGrid.appendChild(card);
    });
}

function exportThemeCode() {
    const colors = JSON.parse(paletteGrid.dataset.colors || "[]");
    if(colors.length === 0) return;
    let codeStr = "export const theme = {\n";
    colors.forEach((c, i) => { codeStr += `  color${i + 1}: '${c.hex}',\n`; });
    codeStr += "};";
    navigator.clipboard.writeText(codeStr);
    const originalText = codeBtn.innerText;
    codeBtn.innerText = "[ COPIED! ]"; codeBtn.style.color = "#fff";
    setTimeout(() => { codeBtn.innerText = originalText; codeBtn.style.color = "#ccff00"; }, 1500);
}

function exportPaletteAsPNG() {
    const colors = JSON.parse(paletteGrid.dataset.colors || "[]");
    if (colors.length === 0) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1200; const height = 600; const padding = 60;
    canvas.width = width; canvas.height = height;

    ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 2;
    for(let i=0; i<width; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,height); ctx.stroke(); }
    ctx.font = 'bold 40px monospace'; ctx.fillStyle = '#ccff00';
    ctx.fillText('CENTROID // PALETTE_SCHEMATIC', padding, 80);
    ctx.font = '20px monospace'; ctx.fillStyle = '#666';
    ctx.fillText('DATE: ' + new Date().toLocaleDateString(), padding, 110);
    const gap = 20; const totalGap = gap * (colors.length - 1);
    const cardWidth = (width - (padding * 2) - totalGap) / colors.length;
    
    colors.forEach((c, i) => {
        const x = padding + (i * (cardWidth + gap));
        const y = 160; const h = 300;
        ctx.fillStyle = c.hex; ctx.fillRect(x, y, cardWidth, h);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(x, y, cardWidth, h);
        ctx.font = 'bold 24px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText(c.hex.toUpperCase(), x, y + h + 40);
        ctx.font = '18px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(c.percentage + '%', x, y + h + 70);
    });

    const link = document.createElement('a');
    link.download = 'centroid_schematic.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

const phrases = ["DIGITAL SOUL", "PIXEL LOGIC", "NEON OPTICS", "K-MEANS CORE", "VISUAL DATA"];
let phraseIndex = 0; let charIndex = 0; let isDeleting = false; let typeSpeed = 100;
function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) { textElement.innerText = currentPhrase.substring(0, charIndex - 1); charIndex--; typeSpeed = 50; } 
    else { textElement.innerText = currentPhrase.substring(0, charIndex + 1); charIndex++; typeSpeed = 150; }
    if (!isDeleting && charIndex === currentPhrase.length) { isDeleting = true; typeSpeed = 2000; } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 500; }
    setTimeout(typeEffect, typeSpeed);
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes slideUpCard { to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(styleSheet);
