document.addEventListener('DOMContentLoaded', () => {
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const borderInput = document.getElementById('border');
    const borderColorInput = document.getElementById('border-color');
    const widthInput = document.getElementById('width');
    const table = document.getElementById('bbcode-table');
    const generateButton = document.getElementById('generate');
    const bbcodeOutput = document.getElementById('bbcode-output');
    const textColorInput = document.getElementById('cell-text-color');
    const bgColorInput = document.getElementById('cell-bg-color');
    const headerTextColorInput = document.getElementById('header-text-color');
    const headerBgColorInput = document.getElementById('header-bg-color');

    let currentCell = null;

    // Create table based on inputs
    function createTable() {
        table.innerHTML = '';
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);

        // Create header row
        const headerRow = document.createElement('tr');
        for (let i = 0; i < cols; i++) {
            const th = document.createElement('th');
            th.contentEditable = true;
            th.textContent = `Header ${i + 1}`;
            th.style.color = headerTextColorInput.value;
            th.style.backgroundColor = headerBgColorInput.value;
            th.addEventListener('click', handleCellClick);
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        // Create table rows
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.contentEditable = true;
                td.textContent = `Cell ${i + 1}-${j + 1}`;
                td.style.color = textColorInput.value; // Default text color
                td.style.backgroundColor = bgColorInput.value; // Default background color
                td.addEventListener('click', handleCellClick);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        // Update table style
        table.style.borderWidth = `${borderInput.value}px`;
        table.style.borderColor = borderColorInput.value;
        table.style.width = `${widthInput.value}%`;
    }

    // Handle cell click event
    function handleCellClick(event) {
        currentCell = event.target;
        if (currentCell.tagName === 'TH') {
            headerTextColorInput.value = rgbToHex(currentCell.style.color);
            headerBgColorInput.value = rgbToHex(currentCell.style.backgroundColor);
        } else {
            textColorInput.value = rgbToHex(currentCell.style.color);
            bgColorInput.value = rgbToHex(currentCell.style.backgroundColor);
        }
    }

    // Apply header color changes in real-time
    headerTextColorInput.addEventListener('input', () => {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.style.color = headerTextColorInput.value;
        });
    });

    headerBgColorInput.addEventListener('input', () => {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.style.backgroundColor = headerBgColorInput.value;
        });
    });

    // Apply cell color changes in real-time when changing color inputs
    textColorInput.addEventListener('input', () => {
        if (currentCell && currentCell.tagName === 'TD') {
            currentCell.style.color = textColorInput.value;
        }
    });

    bgColorInput.addEventListener('input', () => {
        if (currentCell && currentCell.tagName === 'TD') {
            currentCell.style.backgroundColor = bgColorInput.value;
        }
    });

    // Generate BBCode compatible with vBulletin 4
    function generateBBCode() {
        let bbcode = `[TABLE="width: ${widthInput.value}%, align: center, border: ${borderInput.value}px solid ${borderColorInput.value}"]\n`;

        // Add header row
        const headers = table.querySelectorAll('th');
        bbcode += '  [TR]\n';
        headers.forEach(header => {
            const textColor = rgbToHex(header.style.color);
            const bgColor = rgbToHex(header.style.backgroundColor);
            bbcode += `    [TD="bgcolor: ${bgColor}"][COLOR=${textColor}]${header.textContent}[/COLOR][/TD]\n`;
        });
        bbcode += '  [/TR]\n';

        // Add table rows
        const rows = table.querySelectorAll('tr:not(:first-child)');
        rows.forEach(row => {
            bbcode += '  [TR]\n';
            row.querySelectorAll('td').forEach(cell => {
                const textColor = rgbToHex(cell.style.color);
                const bgColor = rgbToHex(cell.style.backgroundColor);
                bbcode += `    [TD="bgcolor: ${bgColor}"][COLOR=${textColor}]${cell.textContent}[/COLOR][/TD]\n`;
            });
            bbcode += '  [/TR]\n';
        });

        bbcode += '[/TABLE]';
        bbcodeOutput.value = bbcode;
    }

    // Convert RGB to Hex
    function rgbToHex(rgb) {
        let rgbValues = rgb.match(/\d+/g);
        if (!rgbValues) return '#000000'; // Default to black if conversion fails
        return `#${((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1).toUpperCase()}`;
    }

    // Event listeners
    rowsInput.addEventListener('input', createTable);
    colsInput.addEventListener('input', createTable);
    borderInput.addEventListener('input', createTable);
    borderColorInput.addEventListener('input', createTable);
    widthInput.addEventListener('input', createTable);
    generateButton.addEventListener('click', generateBBCode);

    // Initial table creation
    createTable();
});
