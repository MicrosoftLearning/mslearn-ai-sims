document.addEventListener('DOMContentLoaded', ()=>{
  const postalEl = document.getElementById('postal');
  const sizeEl = document.getElementById('size');
  const sizeValueEl = document.getElementById('size-value');
  const predictBtn = document.getElementById('predict');
  const resultEl = document.getElementById('result');

  const bedroomEls = document.getElementsByName('bedrooms');

  function getBedrooms(){
    for(const el of bedroomEls){
      if(el.checked) return Number(el.value);
    }
    return 0;
  }

  sizeEl.addEventListener('input', ()=>{
    sizeValueEl.textContent = sizeEl.value;
  });

  function formatUSD(amount){
    return amount.toLocaleString('en-US', {style:'currency', currency:'USD'});
  }

  predictBtn.addEventListener('click', ()=>{
    const postal = postalEl.value;
    const size = Number(sizeEl.value);
    const bedrooms = getBedrooms();

    // This code simulates a machine learning model to predict the monthly rental
    let multiplier = 1;
    if(postal === '0002') multiplier = 1.2;
    if(postal === '0003') multiplier = 1.5;

    const rent = size * multiplier + (300 * bedrooms);

    resultEl.textContent = `Estimated monthly rent: ${formatUSD(rent)}`;
  });

  // Added: fetch and display CSV sample data when link is clicked
  const viewDataLink = document.getElementById('view-data');
  const dataContainer = document.getElementById('data-container');

  function parseCSV(text){
    const rows = [];
    let cur = '';
    let row = [];
    let inQuotes = false;

    for(let i = 0; i < text.length; i++){
      const ch = text[i];
      if(inQuotes){
        if(ch === '"'){
          if(text[i+1] === '"'){
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else {
        if(ch === '"'){
          inQuotes = true;
        } else if(ch === ','){
          row.push(cur);
          cur = '';
        } else if(ch === '\r'){
          continue;
        } else if(ch === '\n'){
          row.push(cur);
          rows.push(row);
          row = [];
          cur = '';
        } else {
          cur += ch;
        }
      }
    }

    if(cur !== '' || row.length){
      row.push(cur);
      rows.push(row);
    }

    return rows.filter(r => !(r.length === 1 && r[0] === ''));
  }

  function renderTable(rows){
    if(!rows || rows.length === 0){
      dataContainer.innerHTML = '<div class="muted">No data found.</div>';
      dataContainer.hidden = false;
      return;
    }

    const headers = rows[0];
    let html = '<div class="table-wrap"><table class="data-table"><thead><tr>';
    for(const h of headers){ html += `<th>${h}</th>`; }
    html += '</tr></thead><tbody>';

    for(let i = 1; i < rows.length; i++){
      const cols = rows[i];
      html += '<tr>';
      for(const c of cols){ html += `<td>${c}</td>`; }
      html += '</tr>';
    }

    html += '</tbody></table></div>';
    dataContainer.innerHTML = html;
    dataContainer.hidden = false;
  }

  // Replace simple fetch with toggling behavior for the sample data link
  if(viewDataLink){
    // keep aria state for accessibility
    viewDataLink.setAttribute('aria-expanded','false');

    viewDataLink.addEventListener('click', (e)=>{
      e.preventDefault();
      if(!dataContainer) return;

      const isVisible = !dataContainer.hidden;
      if(isVisible){
        // hide
        dataContainer.hidden = true;
        viewDataLink.textContent = 'View sample rent data';
        viewDataLink.setAttribute('aria-expanded','false');
        return;
      }

      // show: if already loaded, just reveal
      if(dataContainer.dataset.loaded === 'true' && dataContainer.innerHTML.trim().length > 0){
        dataContainer.hidden = false;
        viewDataLink.textContent = 'Hide sample rent data';
        viewDataLink.setAttribute('aria-expanded','true');
        return;
      }

      // otherwise fetch and render
      const previousText = viewDataLink.textContent;
      viewDataLink.textContent = 'Loading...';

      fetch('data.csv')
        .then(res => { if(!res.ok) throw new Error('Network response was not ok'); return res.text(); })
        .then(text => {
          const rows = parseCSV(text);
          renderTable(rows);
          dataContainer.dataset.loaded = 'true';
          viewDataLink.textContent = 'Hide sample rent data';
          viewDataLink.setAttribute('aria-expanded','true');
        })
        .catch(err => {
          dataContainer.innerHTML = `<div class="muted">Unable to load data: ${err.message}</div>`;
          dataContainer.hidden = false;
          dataContainer.dataset.loaded = 'true';
          viewDataLink.textContent = 'Hide sample rent data';
          viewDataLink.setAttribute('aria-expanded','true');
        });
    });
  }

  // Modal: show model details and manage accessibility
  const viewModelBtn = document.getElementById('view-model');
  const modelModal = document.getElementById('model-modal');
  let _previousActiveElement = null;

  function openModelModal(){
    if(!modelModal) return;
    _previousActiveElement = document.activeElement;
    modelModal.hidden = false;
    viewModelBtn && viewModelBtn.setAttribute('aria-expanded','true');
    const closeBtn = modelModal.querySelector('.modal-close');
    closeBtn && closeBtn.focus();
  }

  function closeModelModal(){
    if(!modelModal) return;
    modelModal.hidden = true;
    viewModelBtn && viewModelBtn.setAttribute('aria-expanded','false');
    try{ _previousActiveElement && _previousActiveElement.focus(); } catch(e){}
  }

  if(viewModelBtn && modelModal){
    const closeBtn = modelModal.querySelector('.modal-close');

    viewModelBtn.addEventListener('click', ()=>{
      openModelModal();
    });

    if(closeBtn){
      closeBtn.addEventListener('click', ()=>{ closeModelModal(); });
    }

    // also wire the textual Close button in the footer
    const textCloseBtn = modelModal.querySelector('#model-close-btn');
    if(textCloseBtn){
      textCloseBtn.addEventListener('click', ()=>{ closeModelModal(); });
    }

    // close when clicking on overlay (but not when clicking inside the content)
    modelModal.addEventListener('click', (e)=>{
      if(e.target === modelModal){ closeModelModal(); }
    });

    // close on Escape
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && !modelModal.hidden){ closeModelModal(); }
    });
  }

});
