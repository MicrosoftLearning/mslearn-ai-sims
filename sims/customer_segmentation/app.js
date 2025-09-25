// Simple CSV loader, K-Means clustering, silhouette score, and plotting using canvas

// Utility: fetch list of files from data folder (simulated)
const dataFiles = [
  'customers.csv'
];

// Embedded fallback contents for environments where fetch of local files is blocked
const embeddedFiles = {
  'customers.csv': `Name,AverageSpend,AverageFrequency
Customer1,88.00,48.0
Customer2,95.00,45.5
Customer3,92.00,46.8
Customer4,85.00,49.2
Customer5,90.00,44.0
Customer6,87.00,47.5
Customer7,94.00,50.0
Customer8,83.00,43.7
Customer9,89.00,45.9
Customer10,86.00,42.5
Customer11,82.00,10.5
Customer12,90.00,7.0
Customer13,88.00,12.2
Customer14,80.00,5.5
Customer15,85.00,9.8
Customer16,92.00,6.0
Customer17,78.00,11.0
Customer18,84.00,8.5
Customer19,79.00,13.0
Customer20,81.00,14.5
Customer21,25.00,48.0
Customer22,30.00,45.5
Customer23,35.00,46.2
Customer24,22.00,49.0
Customer25,40.00,44.5
Customer26,28.00,47.0
Customer27,33.00,43.0
Customer28,27.00,42.8
Customer29,32.00,46.5
Customer30,20.00,50.0
Customer31,18.00,10.0
Customer32,34.00,8.5
Customer33,15.00,6.0
Customer34,45.00,12.0
Customer35,19.00,5.0
Customer36,48.00,14.0
Customer37,22.00,11.5
Customer38,36.00,9.0
Customer39,17.00,7.5
Customer40,29.00,13.5
`};

// color palette for clusters (ensure defined before use)
const CLUSTER_COLORS = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];

const uploadBtn = document.getElementById('uploadBtn');
const fileModal = document.getElementById('fileModal');
const fileList = document.getElementById('fileList');
const closeModal = document.getElementById('closeModal');
const tableContainer = document.getElementById('tableContainer');
const analysisControls = document.getElementById('analysisControls');
const analyzeBtn = document.getElementById('analyzeBtn');
const status = document.getElementById('status');
const scatterCanvas = document.getElementById('scatterCanvas');
const ctx = scatterCanvas.getContext('2d');
const filePreview = document.getElementById('filePreview');
const filenameInput = document.getElementById('filenameInput');
const clusterIndicator = document.getElementById('clusterIndicator');
const plotContainer = document.getElementById('plotContainer');
const errorModal = document.getElementById('errorModal');
const errorDetails = document.getElementById('errorDetails');
const errorCloseBtn = document.getElementById('errorCloseBtn');
const debugLog = document.getElementById('debugLog');
const kScores = document.getElementById('kScores');
const kScoresList = document.getElementById('kScoresList');
const clusterSummary = document.getElementById('clusterSummary');
const clusterSummaryList = document.getElementById('clusterSummaryList');

let currentData = []; // array of {Name, AverageSpend, AverageFrequency}
let selectedFile = null;

function appendDebug(msg) {
  if (!debugLog) return;
  const now = new Date().toISOString();
  debugLog.textContent = now + ' - ' + msg + '\n' + debugLog.textContent;
}

// add debug messages in key places
// ...existing code...
function showFileModal() {
  fileList.innerHTML = '';
  fileList.setAttribute('aria-activedescendant', '');
  selectedFile = null;
  filenameInput.value = '';
  filePreview.textContent = 'Select a file to see a preview';
  dataFiles.forEach(f => {
    const li = document.createElement('li');
    li.id = 'file-' + f;
    li.tabIndex = 0;
    
    // Create file icon
    const icon = document.createElement('span');
    icon.className = 'file-icon';
    icon.setAttribute('aria-hidden', 'true');
    
    // Create filename text
    const filename = document.createElement('span');
    filename.className = 'filename';
    filename.textContent = f;
    
    li.appendChild(icon);
    li.appendChild(filename);
    li.setAttribute('role','option');
    li.addEventListener('click', () => {
      // mark selection
      Array.from(fileList.children).forEach(c=>c.classList.remove('selected'));
      li.classList.add('selected');
      selectedFile = f;
      filenameInput.value = f;
      // try to fetch a short preview (first few lines) from embeddedFiles or data folder
      const fetchPath = './data/' + f;
      (async ()=>{
        try {
          const res = await fetch(fetchPath);
          if (!res.ok) throw new Error('Fetch failed');
          const txt = await res.text();
          filePreview.textContent = txt.split(/\r?\n/).slice(0,10).join('\n');
        } catch (err) {
          if (embeddedFiles[f]) {
            filePreview.textContent = embeddedFiles[f].split(/\r?\n/).slice(0,10).join('\n');
          } else {
            filePreview.textContent = 'Unable to preview file';
          }
        }
      })();
    });
    li.addEventListener('dblclick', () => {
      selectedFile = f;
      filenameInput.value = f;
      selectFile(f);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { li.click(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (li.nextSibling) li.nextSibling.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (li.previousSibling) li.previousSibling.focus(); }
    });
    fileList.appendChild(li);
  });
  fileModal.style.display = 'flex';
}

async function selectFile(path) {
  // 'path' here is the filename from the simulated picker
  fileModal.style.display = 'none';
  // construct a relative URL to the data folder based on current page location
  const fetchPath = new URL('data/' + path, window.location.href).href;
  appendDebug('Fetching relative path: ' + fetchPath);
  try {
    const res = await fetch(fetchPath);
    if (!res.ok) throw new Error('Failed to fetch ' + fetchPath + ' (status ' + res.status + ')');
    const text = await res.text();
    parseCSV(text);
    renderTable();
    analysisControls.style.display = 'block';
    onDataLoaded();
    appendDebug('Loaded file from ' + fetchPath);
    return;
  } catch (err) {
    appendDebug('Fetch failed for ' + fetchPath + ': ' + (err && err.message ? err.message : String(err)));
    // fallback to embedded only if available
    if (embeddedFiles[path]) {
      console.warn('Relative fetch failed, falling back to embedded content for', path, err && err.message ? err.message : err);
      appendDebug('Using embedded fallback for ' + path);
      parseCSV(embeddedFiles[path]);
      renderTable();
      analysisControls.style.display = 'block';
      onDataLoaded();
      return;
    }
    // otherwise show clear error
    const msg = 'Unable to load file from data folder: ' + (err && err.message ? err.message : String(err));
    alert(msg);
    appendDebug(msg);
  }
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  if (!lines || lines.length === 0) { currentData = []; return; }
  const headers = lines[0].split(',').map(h => h.trim());
  const dataLines = lines.slice(1).filter(l => l.trim().length > 0);
  currentData = dataLines.map(line => {
    const cols = line.split(',').map(c => c.trim());
    return {
      Name: cols[0] || '',
      AverageSpend: parseFloat(cols[1]),
      AverageFrequency: parseFloat(cols[2])
    };
  });
}

function renderTable() {
  // if no data show friendly message
  if (!currentData || currentData.length === 0) {
    tableContainer.innerHTML = '<div class="table-container">No data loaded</div>';
    return;
  }

  // only show Cluster column when clustering has been performed
  const showCluster = currentData.some(d => d.Cluster != null);

  const tbl = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Name','AverageSpend','AverageFrequency'];
  if (showCluster) headers.push('Cluster');
  headers.forEach(h => { const th = document.createElement('th'); th.textContent = h; headerRow.appendChild(th); });
  thead.appendChild(headerRow);
  tbl.appendChild(thead);
  const tbody = document.createElement('tbody');
  currentData.forEach((r, i) => {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td'); nameTd.textContent = r.Name; tr.appendChild(nameTd);
    const spendTd = document.createElement('td'); spendTd.textContent = isNaN(r.AverageSpend) ? '' : r.AverageSpend.toFixed(2); tr.appendChild(spendTd);
    const freqTd = document.createElement('td'); freqTd.textContent = isNaN(r.AverageFrequency) ? '' : r.AverageFrequency.toFixed(2); tr.appendChild(freqTd);
    if (showCluster) {
      const clusterTd = document.createElement('td'); clusterTd.textContent = r.Cluster != null ? r.Cluster : ''; tr.appendChild(clusterTd);
    }
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  // replace contents
  tableContainer.innerHTML = '';
  tableContainer.appendChild(tbl);
}

function drawScatter(points, clusters=null, centroids=null) {
  // clear
  ctx.clearRect(0,0,scatterCanvas.width, scatterCanvas.height);
  // compute bounds
  const padding = 40;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const scaleX = (scatterCanvas.width - padding*2) / (xmax - xmin || 1);
  const scaleY = (scatterCanvas.height - padding*2) / (ymax - ymin || 1);

  function toCanvasX(x) { return padding + (x - xmin) * scaleX; }
  function toCanvasY(y) { return scatterCanvas.height - padding - (y - ymin) * scaleY; }

  // axes
  ctx.strokeStyle = '#ccc'; ctx.beginPath(); ctx.moveTo(padding, padding); ctx.lineTo(padding, scatterCanvas.height - padding); ctx.lineTo(scatterCanvas.width - padding, scatterCanvas.height - padding); ctx.stroke();

  // plot points
  const colors = CLUSTER_COLORS;
  points.forEach((p, idx) => {
    const cx = toCanvasX(p.x), cy = toCanvasY(p.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI*2);
    ctx.fillStyle = clusters ? colors[clusters[idx] % colors.length] : '#1e88e5';
    ctx.fill();
  });

  // plot centroids
  if (centroids) {
    centroids.forEach((c, i) => {
      const cx = toCanvasX(c.x), cy = toCanvasY(c.y);
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2);
      ctx.fillStyle = colors[i % colors.length]; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
  }

  // labels
  ctx.fillStyle = '#333'; ctx.font = '12px Arial';
  ctx.fillText('AverageFrequency', scatterCanvas.width/2 - 40, scatterCanvas.height - 8);
  ctx.save(); ctx.translate(10, scatterCanvas.height/2 + 40); ctx.rotate(-Math.PI/2); ctx.fillText('AverageSpend', 0, 0); ctx.restore();
}

// K-Means implementation
const RESTARTS_PER_K = 20;
const RNG_SEED_BASE = 123456789;

function makeSeededRng(seed) {
  // simple LCG -> returns a function that yields [0,1)
  let s = seed >>> 0;
  return function() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function kmeans(points, K, maxIter=100, rng = Math.random) {
  // points: array of {x,y}
  // init: pick K random distinct points as centroids using provided rng
  const centroids = [];
  const used = new Set();
  while (centroids.length < K) {
    const idx = Math.floor(rng() * points.length);
    if (used.has(idx)) continue; used.add(idx);
    centroids.push({x: points[idx].x, y: points[idx].y});
  }

  let assignments = new Array(points.length).fill(-1);
  for (let iter=0; iter<maxIter; iter++) {
    let moved = false;
    // assign
    for (let i=0;i<points.length;i++) {
      let best = -1, bestDist = Infinity;
      for (let k=0;k<K;k++) {
        const d = (points[i].x - centroids[k].x)**2 + (points[i].y - centroids[k].y)**2;
        if (d < bestDist) { bestDist = d; best = k; }
      }
      if (assignments[i] !== best) { assignments[i] = best; moved = true; }
    }
    // update centroids
    const sums = new Array(K).fill(0).map(()=>({x:0,y:0,count:0}));
    for (let i=0;i<points.length;i++) {
      const a = assignments[i]; sums[a].x += points[i].x; sums[a].y += points[i].y; sums[a].count += 1;
    }
    for (let k=0;k<K;k++) {
      if (sums[k].count > 0) {
        centroids[k].x = sums[k].x / sums[k].count; centroids[k].y = sums[k].y / sums[k].count;
      } else {
        // reinitialize empty centroid to a random data point to avoid permanently empty clusters
        const idx = Math.floor(rng() * points.length);
        centroids[k] = {x: points[idx].x, y: points[idx].y};
        moved = true;
      }
    }
    if (!moved) break;
  }
  return {assignments, centroids};
}

// silhouette score
function silhouetteScore(points, assignments, K) {
  const n = points.length;
  const clusters = new Array(K).fill(0).map(()=>[]);
  for (let i=0;i<n;i++) {
    const a = assignments[i];
    if (typeof a !== 'number' || a < 0 || a >= K) continue; // ignore invalid assignment
    clusters[a].push(i);
  }

  function dist(a,b) { return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2); }

  let total = 0;
  let counted = 0;
  const perPoint = new Array(n).fill(0);
  for (let i=0;i<n;i++) {
    const own = assignments[i];
    if (typeof own !== 'number' || own < 0 || own >= K) { perPoint[i] = 0; continue; }
    const ownCluster = clusters[own];
    const a = (ownCluster.length <= 1) ? 0 : (ownCluster.reduce((s, idx)=> s + dist(points[i], points[idx]), 0) / (ownCluster.length - 1));
    let b = Infinity;
    for (let k=0;k<K;k++) if (k !== own && clusters[k].length>0) {
      const avg = clusters[k].reduce((s, idx)=> s + dist(points[i], points[idx]), 0) / clusters[k].length;
      if (avg < b) b = avg;
    }
    const s = (b === Infinity && a === 0) ? 0 : (b - a) / Math.max(a,b);
    perPoint[i] = s;
    total += s;
    counted += 1;
  }
  const overall = counted === 0 ? 0 : total / counted;
  return { score: overall, perPoint };
}

function setClusterIndicator(state, text) {
  if (!clusterIndicator) return;
  clusterIndicator.classList.remove('not-analyzed','running','complete');
  clusterIndicator.classList.add(state);
  clusterIndicator.textContent = text;
}

// when data is loaded, reset indicator and hide plot
function onDataLoaded() {
  setClusterIndicator('not-analyzed','Not analyzed');
  plotContainer.style.display = 'none';
}

function setStatus(text) {
  if (typeof status !== 'undefined' && status) status.textContent = text;
  try { appendDebug && appendDebug('STATUS: ' + text); } catch (e) { /* ignore */ }
}

analyzeBtn && analyzeBtn.addEventListener && analyzeBtn.addEventListener('click', async () => {
  try {
    setClusterIndicator('running', 'Analyzing...');
    plotContainer.style.display = 'none';
    // workflow: show status, create points, run kmeans K=2..5, compute silhouette, pick best
    setStatus('Analyzing data...');
    await new Promise(resolve => setTimeout(resolve, 50)); // allow UI to update
    const points = currentData.map(d => ({x: d.AverageFrequency, y: d.AverageSpend}));

    // validation: ensure numeric values
    const invalidIndexes = [];
    points.forEach((p, idx) => {
      if (typeof p.x !== 'number' || typeof p.y !== 'number' || isNaN(p.x) || isNaN(p.y)) invalidIndexes.push(idx);
    });
    if (invalidIndexes.length > 0 || points.length === 0) {
      const sample = invalidIndexes.slice(0,5).map(i => ({index:i, row: currentData[i]}));
      console.warn('Invalid numeric data detected at rows:', invalidIndexes, sample);
      setClusterIndicator('not-analyzed', 'Invalid data');
      setStatus('Analysis halted: invalid or missing numeric values in data. See console for examples.');
      // show a tooltip-like preview of first few invalid rows in console
      console.group('Invalid data samples');
      sample.forEach(s => console.log('Row', s.index+2, s.row));
      console.groupEnd();
      return; // bail out of analysis
    }

    // show kScores area
    if (kScores) { kScores.style.display = 'block'; kScoresList.innerHTML = ''; }
    let best = {K:3, score:-Infinity, assignments:null, centroids:null};
    for (let K=3; K<=5; K++) {
      if (points.length < K) {
        console.warn(`Skipping K=${K} because number of points (${points.length}) < K`);
        appendDebug('Skipping K=' + K + ' because points<' + K);
        continue;
      }
      let bestForK = {score:-Infinity, assignments:null, centroids:null};
      for (let r=0;r<RESTARTS_PER_K;r++) {
        setStatus(`Analyzing K=${K}, restart ${r+1}/${RESTARTS_PER_K}...`);
        // small pause to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 10));
        const rng = makeSeededRng(RNG_SEED_BASE + K*1000 + r);
        const res = kmeans(points, K, 100, rng);
        const silRes = silhouetteScore(points, res.assignments, K);
        const score = silRes.score;
        if (score > bestForK.score) {
          bestForK = {score, assignments: res.assignments.slice(), centroids: res.centroids.map(c=>({x:c.x,y:c.y})), perPoint: silRes.perPoint.slice()};
        }
      }
      console.log('K=',K,' best score=',bestForK.score);
      appendDebug('K=' + K + ' best silhouette=' + (isFinite(bestForK.score) ? bestForK.score.toFixed(3) : 'n/a'));
      // update UI list
      if (kScoresList) {
        const li = document.createElement('li');
        li.textContent = `K=${K}: ${isFinite(bestForK.score) ? bestForK.score.toFixed(3) : 'n/a'}`;
        kScoresList.appendChild(li);
      }
      if (bestForK.score > best.score) {
        best = {K, score: bestForK.score, assignments: bestForK.assignments, centroids: bestForK.centroids};
      }
    }

    // apply clusters
    if (best.assignments && best.assignments.length === currentData.length) {
      currentData.forEach((d,i) => { d.Cluster = best.assignments[i]; });
    } else {
      // fallback: clear clusters
      currentData.forEach((d) => { d.Cluster = null; });
    }
    renderTable();
    // compute cluster summaries
    if (best.assignments) {
      const counts = {};
      const sums = {};
      const silSums = {};
      best.assignments.forEach((cIdx,i) => {
        if (typeof cIdx !== 'number') return;
        if (!counts[cIdx]) { counts[cIdx] = 0; sums[cIdx] = {freq:0, spend:0}; silSums[cIdx] = 0; }
        counts[cIdx] += 1;
        sums[cIdx].freq += currentData[i].AverageFrequency;
        sums[cIdx].spend += currentData[i].AverageSpend;
        // per-point silhouette value may be stored on best.perPoint (if available) else recompute below
        if (best.perPoint && typeof best.perPoint[i] === 'number') silSums[cIdx] += best.perPoint[i];
      });
      // if perPoint not available for best, compute fresh
      if (!best.perPoint) {
        const freshSil = silhouetteScore(points, best.assignments, best.K);
        const per = freshSil.perPoint;
        best.perPoint = per;
        best.score = freshSil.score;
        best.assignments.forEach((cIdx,i) => { if (typeof cIdx === 'number') { silSums[cIdx] = (silSums[cIdx] || 0) + per[i]; } });
      }
      // build HTML table
      if (clusterSummaryList) {
        let html = '<table><thead><tr><th>Cluster</th><th>Count</th><th>Mean Frequency</th><th>Mean Spend</th><th>Mean Silhouette</th></tr></thead><tbody>';
        Object.keys(counts).sort((a,b)=>a-b).forEach(k => {
          const cnt = counts[k];
          const mf = (sums[k].freq / cnt).toFixed(2);
          const ms = (sums[k].spend / cnt).toFixed(2);
          const msil = (silSums[k] / cnt).toFixed(3);
          html += `<tr><td>${k}</td><td>${cnt}</td><td>${mf}</td><td>${ms}</td><td>${msil}</td></tr>`;
        });
        html += '</tbody></table>';
        clusterSummaryList.innerHTML = html;
        if (clusterSummary) clusterSummary.style.display = 'block';
      }
      // render legend with colors and per-cluster silhouette values
      const legendEl = document.getElementById('clusterLegend');
      if (legendEl) {
        legendEl.innerHTML = '';
        Object.keys(counts).sort((a,b)=>a-b).forEach(k => {
          const color = CLUSTER_COLORS[k % CLUSTER_COLORS.length];
          const meanSil = (silSums[k] / counts[k]).toFixed(3);
          const item = document.createElement('div');
          item.className = 'legend-item';
          item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span> Cluster ${k} — n=${counts[k]} — silhouette=${meanSil}`;
          legendEl.appendChild(item);
        });
      }
    } else {
      if (clusterSummary) clusterSummary.style.display = 'none';
    }
    // show plot after analysis
    plotContainer.style.display = 'block';
    if (typeof ctx !== 'undefined' && ctx) drawScatter(points, best.assignments, best.centroids);
    setClusterIndicator('complete', `Complete — K=${best.K}`);
    setStatus('Analysis complete. Best K = ' + best.K + ' (silhouette=' + (best.score !== -Infinity ? best.score.toFixed(3) : 'n/a') + ')');
  } catch (err) {
    console.error('Error during analysis:', err && err.stack ? err.stack : err);
    appendDebug('Analysis failed: ' + (err && err.stack ? err.stack : (err && err.message ? err.message : String(err))));
    setClusterIndicator('not-analyzed', 'Analysis error');
    setStatus('Analysis error: ' + (err && err.message ? err.message : String(err)) + '. See console for details.');
    // immediate fallback alert so user always sees the error
    try { alert('Analysis error:\n\n' + (err && err.stack ? err.stack : (err && err.message ? err.message : String(err)))); } catch (e) { /* ignore */ }
    showErrorModal && showErrorModal('Analysis error', err);
  }
});

const openModalBtn = document.getElementById('openModal');

if (openModalBtn && openModalBtn.addEventListener) openModalBtn.addEventListener('click', () => {
  const toOpen = filenameInput.value || selectedFile;
  if (!toOpen) {
    alert('Please select a file first');
    return;
  }
  selectFile(toOpen);
});

if (uploadBtn && uploadBtn.addEventListener) uploadBtn.addEventListener('click', showFileModal); else console.error('Upload button not found');
if (closeModal && closeModal.addEventListener) closeModal.addEventListener('click', ()=> fileModal.style.display = 'none'); else console.error('Close modal button not found');

// close modal on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && fileModal.style.display === 'flex') fileModal.style.display = 'none';
});

// initial placeholder plot (guarded)
if (typeof ctx !== 'undefined' && ctx) {
  drawScatter([{x:10,y:100},{x:20,y:120},{x:30,y:80}], null, null);
} else {
  console.warn('Canvas context not available; skipping initial plot');
}
