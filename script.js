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

    // Create or update table based on inputs
    function createTable() {
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);

        const existingData = saveCurrentTableState();

        // Clear and recreate table
        table.innerHTML = '';

        // Create header row
        const headerRow = document.createElement('tr');
        for (let i = 0; i < cols; i++) {
            const th = document.createElement('th');
            th.contentEditable = true;
            th.textContent = `Header ${i + 1}`;
            th.style.color = headerTextColorInput.value;
            th.style.backgroundColor = headerBgColorInput.value;
            th.addEventListener('click', handleCellClick);

            // Restore header data if available
            if (existingData.headers && existingData.headers[i]) {
                th.textContent = existingData.headers[i].content;
                th.style.color = existingData.headers[i].color;
                th.style.backgroundColor = existingData.headers[i].bgcolor;
            }

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
                td.style.color = textColorInput.value;
                td.style.backgroundColor = bgColorInput.value;
                td.addEventListener('click', handleCellClick);

                // Restore cell data if available
                if (existingData.cells && existingData.cells[i] && existingData.cells[i][j]) {
                    td.textContent = existingData.cells[i][j].content;
                    td.style.color = existingData.cells[i][j].color;
                    td.style.backgroundColor = existingData.cells[i][j].bgcolor;
                }

                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        // Update table style
        table.style.borderWidth = `${borderInput.value}px`;
        table.style.borderColor = borderColorInput.value;
        table.style.width = `${widthInput.value}%`;
    }

    // Save current table state (content, colors)
    function saveCurrentTableState() {
        const headers = [];
        const cells = [];

        table.querySelectorAll('th').forEach((th, index) => {
            headers[index] = {
                content: th.textContent,
                color: th.style.color,
                bgcolor: th.style.backgroundColor
            };
        });

        table.querySelectorAll('tr:not(:first-child)').forEach((tr, rowIndex) => {
            const rowCells = [];
            tr.querySelectorAll('td').forEach((td, colIndex) => {
                rowCells[colIndex] = {
                    content: td.textContent,
                    color: td.style.color,
                    bgcolor: td.style.backgroundColor
                };
            });
            cells[rowIndex] = rowCells;
        });

        return { headers, cells };
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
        if (currentCell && currentCell.tagName === 'TH') {
            currentCell.style.color = headerTextColorInput.value;
        }
    });

    headerBgColorInput.addEventListener('input', () => {
        if (currentCell && currentCell.tagName === 'TH') {
            currentCell.style.backgroundColor = headerBgColorInput.value;
        }
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
