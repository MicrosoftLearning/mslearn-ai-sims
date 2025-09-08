(function () {
  const receipts = [
    'receipt-1.png',
    'receipt-2.png',
    'receipt-3.png'
  ];

  // Simulated file system details shown in the dialog (size + modified date)
  const fileDetails = {
    'receipt-1.png': { size: '24 KB', modified: 'Aug 23, 2025 14:32' },
    'receipt-2.png': { size: '33 KB', modified: 'Aug 24, 2025 09:18' },
    'receipt-3.png': { size: '19 KB', modified: 'Jul 12, 2024 16:05' }
  };

  const metadata = {
    'receipt-1.png': { vendor: 'Northwind Traders', date: 'August 25th 2025', amount: '$11.85' },
    'receipt-2.png': { vendor: 'Contoso', date: 'August 25th 2025', amount: '$19.15' },
    'receipt-3.png': { vendor: 'Fourth Coffee', date: 'August 15th 2024', amount: '$6.97' }
  };

  const uploadBtn = document.getElementById('uploadBtn');
  const fileModal = document.getElementById('fileModal');
  const fileList = document.getElementById('fileList');
  const closeModal = document.getElementById('closeModal');
  let receiptImage = null;
  const leftPlaceholder = document.getElementById('leftPlaceholder');
  const rightContent = document.getElementById('rightContent');

  // Selection state and modal controls
  let selectedFile = null;
  let openBtn = null;
  let cancelBtn = null;

  function openModal() {
    fileModal.classList.add('open');
    fileModal.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.disabled = !selectedFile;
    const first = fileModal.querySelector('.file-btn');
    if (first) first.focus();
  }

  function closeModalFn() {
    fileModal.classList.remove('open');
    fileModal.setAttribute('aria-hidden', 'true');
    // clear visual selection
    const prev = fileModal.querySelector('.file-btn.selected');
    if (prev) {
      prev.classList.remove('selected');
      prev.setAttribute('aria-selected', 'false');
    }
    selectedFile = null;
    if (openBtn) openBtn.disabled = true;
  }

  function populateFileList() {
    fileList.innerHTML = '';

    receipts.forEach((name) => {
      const li = document.createElement('li');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'file-btn';
      btn.dataset.file = name;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', 'false');

      const img = document.createElement('img');
      img.src = `receipts/${name}`;
      img.alt = `${name} thumbnail`;

      const nameWrap = document.createElement('div');
      nameWrap.className = 'file-name-wrap';
      const nameSpan = document.createElement('div');
      nameSpan.className = 'file-name';
      nameSpan.textContent = name;
      const subSpan = document.createElement('div');
      subSpan.className = 'file-sub';
      subSpan.textContent = `${fileDetails[name].size} • ${fileDetails[name].modified}`;
      nameWrap.appendChild(nameSpan);
      nameWrap.appendChild(subSpan);

      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'file-size';
      sizeDiv.textContent = fileDetails[name].size;

      const dateDiv = document.createElement('div');
      dateDiv.className = 'file-date';
      dateDiv.textContent = fileDetails[name].modified;

      btn.appendChild(img);
      btn.appendChild(nameWrap);
      btn.appendChild(sizeDiv);
      btn.appendChild(dateDiv);

      // Select the file (do not immediately "open" it)
      btn.addEventListener('click', function () {
        setSelectedFile(name, btn);
      });

      // keyboard support to select
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedFile(name, btn);
        }
      });

      li.appendChild(btn);
      fileList.appendChild(li);
    });
  }

  function setSelectedFile(name, btn) {
    const prev = fileModal.querySelector('.file-btn.selected');
    if (prev) {
      prev.classList.remove('selected');
      prev.setAttribute('aria-selected', 'false');
    }

  btn.classList.add('selected');
  btn.setAttribute('aria-selected', 'true');
  selectedFile = name;

  if (openBtn) openBtn.disabled = false;
  if (openBtn) openBtn.focus();
  }

  function selectFile(filename) {
    closeModalFn();

    leftPlaceholder.style.display = 'none';
    // Remove previous image if exists
    if (receiptImage && receiptImage.parentNode) {
      receiptImage.parentNode.removeChild(receiptImage);
    }
    // Create new image element
    receiptImage = document.createElement('img');
    receiptImage.id = 'receiptImage';
    receiptImage.src = `receipts/${filename}`;
    receiptImage.alt = `Original ${filename}`;
    const leftDiv = document.querySelector('.left');
    leftDiv.appendChild(receiptImage);

    rightContent.innerHTML = `<div class="analyzing"><div class="spinner" aria-hidden="true"></div><div>Analyzing receipt...</div></div>`;

    setTimeout(() => {
      receiptImage.src = `results/${filename}`;
      receiptImage.alt = `Analyzed ${filename}`;
      rightContent.innerHTML = generateTable(filename);
    }, 3000);
  }

  function generateTable(filename) {
    const meta = metadata[filename] || { vendor: '-', date: '-', amount: '-' };
    return `
      <div class="analysis-result" aria-live="polite">
        <div class="result-file-name">${filename}</div>

        <div class="result-field">
          <h3>Vendor</h3>
          <div class="field-value">${meta.vendor}</div>
        </div>

        <div class="result-field">
          <h3>Date</h3>
          <div class="field-value">${meta.date}</div>
        </div>

        <div class="result-field">
          <h3>Amount</h3>
          <div class="field-value">${meta.amount}</div>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', function () {
    populateFileList();

    openBtn = document.getElementById('openBtn');
    cancelBtn = document.getElementById('cancelBtn');

    uploadBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFn);
    cancelBtn.addEventListener('click', closeModalFn);

    openBtn.addEventListener('click', function () {
      if (selectedFile) selectFile(selectedFile);
    });

    // Do not close modal by clicking the overlay — keep it modal.

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fileModal.classList.contains('open')) closeModalFn();
    });
    // Initial state: show only the message, no image element
    leftPlaceholder.style.display = '';
    leftPlaceholder.textContent = 'No receipt selected';
    // Remove image if present
    const imgEl = document.getElementById('receiptImage');
    if (imgEl && imgEl.parentNode) {
      imgEl.parentNode.removeChild(imgEl);
    }
  });

})();
