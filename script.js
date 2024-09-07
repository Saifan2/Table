document.addEventListener('DOMContentLoaded', () => {
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const borderInput = document.getElementById('border');
    const borderColorInput = document.getElementById('border-color');
    const widthInput = document.getElementById('width');
    const tableContainer = document.getElementById('table-container');
    const generateButton = document.getElementById('generate');
    const bbcodeOutput = document.getElementById('bbcode-output');
    const textColorInput = document.getElementById('cell-text-color');
    const bgColorInput = document.getElementById('cell-bg-color');
    const headerTextColorInput = document.getElementById('header-text-color');
    const headerBgColorInput = document.getElementById('header-bg-color');
    const headerFontSelect = document.getElementById('header-font');
    const headerSizeSelect = document.getElementById('header-size');
    const cellFontSelect = document.getElementById('cell-font');
    const cellSizeSelect = document.getElementById('cell-size');
    const headerBoldCheckbox = document.getElementById('header-bold');
    const headerItalicCheckbox = document.getElementById('header-italic');
    const headerUnderlineCheckbox = document.getElementById('header-underline');
    const cellBoldCheckbox = document.getElementById('cell-bold');
    const cellItalicCheckbox = document.getElementById('cell-italic');
    const cellUnderlineCheckbox = document.getElementById('cell-underline');

    let selectedCells = [];

    const fonts = ["Arial", "Arial Black", "Arial Narrow", "Book Antiqua", "Century Gothic", "Comic Sans MS", "Courier New", "Fixedsys", "Franklin Gothic Medium", "Garamond", "Georgia", "Impact", "Lucida Console", "Lucida Sans Unicode", "Microsoft Sans Serif", "Palatino Linotype", "System", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana", "rancho", "almoni-dl", "Open Sans Hebrew"];
    const sizes = ["1", "2", "3", "4", "5", "6", "7"];

    function populateSelectOptions() {
        fonts.forEach(font => {
            headerFontSelect.add(new Option(font, font));
            cellFontSelect.add(new Option(font, font));
        });

        sizes.forEach(size => {
            headerSizeSelect.add(new Option(size, size));
            cellSizeSelect.add(new Option(size, size));
        });
    }

    function createTable() {
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);
        let existingTable = document.getElementById('bbcode-table');
        let existingContent = [];

        // Preserve existing content
        if (existingTable) {
            existingContent = Array.from(existingTable.rows).map(row => 
                Array.from(row.cells).map(cell => ({
                    content: cell.innerHTML,
                    style: cell.getAttribute('style')
                }))
            );
        }

        let tableHTML = `<table id="bbcode-table" style="border: ${borderInput.value}px solid ${borderColorInput.value}; width: ${widthInput.value}%;">`;

        // Create header row
        tableHTML += '<tr>';
        for (let i = 0; i < cols; i++) {
            let cellContent = existingContent[0] && existingContent[0][i] ? existingContent[0][i].content : `Header ${i + 1}`;
            let cellStyle = existingContent[0] && existingContent[0][i] ? existingContent[0][i].style : 
                `color: ${headerTextColorInput.value}; background-color: ${headerBgColorInput.value}; font-family: ${headerFontSelect.value}; font-size: ${headerSizeSelect.value}em;`;
            tableHTML += `<th contenteditable="true" style="${cellStyle}">${cellContent}</th>`;
        }
        tableHTML += '</tr>';

        // Create table rows
        for (let i = 1; i < rows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) {
                let cellContent = existingContent[i] && existingContent[i][j] ? existingContent[i][j].content : `Cell ${i}-${j + 1}`;
                let cellStyle = existingContent[i] && existingContent[i][j] ? existingContent[i][j].style : 
                    `color: ${textColorInput.value}; background-color: ${bgColorInput.value}; font-family: ${cellFontSelect.value}; font-size: ${cellSizeSelect.value}em;`;
                tableHTML += `<td contenteditable="true" style="${cellStyle}">${cellContent}</td>`;
            }
            tableHTML += '</tr>';
        }

        tableHTML += '</table>';
        tableContainer.innerHTML = tableHTML;

        // Add event listeners to cells
        const cells = document.querySelectorAll('#bbcode-table th, #bbcode-table td');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }

    function handleCellClick(event) {
        const cell = event.target;
        if (event.ctrlKey || event.metaKey) {
            // Multi-select
            cell.classList.toggle('selected');
            const index = selectedCells.indexOf(cell);
            if (index > -1) {
                selectedCells.splice(index, 1);
            } else {
                selectedCells.push(cell);
            }
        } else {
            // Single select
            selectedCells.forEach(c => c.classList.remove('selected'));
            selectedCells = [cell];
            cell.classList.add('selected');
        }
        updateStyleInputs();
    }

    function updateStyleInputs() {
        if (selectedCells.length > 0) {
            const cell = selectedCells[0];
            const isHeader = cell.tagName === 'TH';
            const currentTextColorInput = isHeader ? headerTextColorInput : textColorInput;
            const currentBgColorInput = isHeader ? headerBgColorInput : bgColorInput;
            const currentFontSelect = isHeader ? headerFontSelect : cellFontSelect;
            const currentSizeSelect = isHeader ? headerSizeSelect : cellSizeSelect;
            const currentBoldCheckbox = isHeader ? headerBoldCheckbox : cellBoldCheckbox;
            const currentItalicCheckbox = isHeader ? headerItalicCheckbox : cellItalicCheckbox;
            const currentUnderlineCheckbox = isHeader ? headerUnderlineCheckbox : cellUnderlineCheckbox;

            currentTextColorInput.value = rgbToHex(cell.style.color);
            currentBgColorInput.value = rgbToHex(cell.style.backgroundColor);
            currentFontSelect.value = cell.style.fontFamily.replace(/['"]+/g, '');
            currentSizeSelect.value = cell.style.fontSize.replace('em', '');
            currentBoldCheckbox.checked = cell.style.fontWeight === 'bold';
            currentItalicCheckbox.checked = cell.style.fontStyle === 'italic';
            currentUnderlineCheckbox.checked = cell.style.textDecoration.includes('underline');
        }
    }

    function updateCellStyles() {
        selectedCells.forEach(cell => {
            const isHeader = cell.tagName === 'TH';
            const currentTextColorInput = isHeader ? headerTextColorInput : textColorInput;
            const currentBgColorInput = isHeader ? headerBgColorInput : bgColorInput;
            const currentFontSelect = isHeader ? headerFontSelect : cellFontSelect;
            const currentSizeSelect = isHeader ? headerSizeSelect : cellSizeSelect;
            const currentBoldCheckbox = isHeader ? headerBoldCheckbox : cellBoldCheckbox;
            const currentItalicCheckbox = isHeader ? headerItalicCheckbox : cellItalicCheckbox;
            const currentUnderlineCheckbox = isHeader ? headerUnderlineCheckbox : cellUnderlineCheckbox;

            cell.style.color = currentTextColorInput.value;
            cell.style.backgroundColor = currentBgColorInput.value;
            cell.style.fontFamily = currentFontSelect.value;
            cell.style.fontSize = `${currentSizeSelect.value}em`;
            cell.style.fontWeight = currentBoldCheckbox.checked ? 'bold' : 'normal';
            cell.style.fontStyle = currentItalicCheckbox.checked ? 'italic' : 'normal';
            cell.style.textDecoration = currentUnderlineCheckbox.checked ? 'underline' : 'none';
        });
    }

    function generateBBCode() {
        let bbcode = `[TABLE="width: ${widthInput.value}%, align: center, border: ${borderInput.value}px solid ${borderColorInput.value}"]\n`;

        const rows = document.querySelectorAll('#bbcode-table tr');
        rows.forEach(row => {
            bbcode += '  [TR]\n';
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                const isHeader = cell.tagName === 'TH';
                let cellContent = cell.textContent;

                // Start with TD tag
                bbcode += '    [TD';
                if (cell.style.backgroundColor) {
                    bbcode += `="bgcolor: ${rgbToHex(cell.style.backgroundColor)}"`;
                }
                bbcode += ']';

                // Add individual style tags
                if (cell.style.color) {
                    bbcode += `[COLOR=${rgbToHex(cell.style.color)}]`;
                }
                if (cell.style.fontFamily) {
                    bbcode += `[FONT=${cell.style.fontFamily.replace(/['"]+/g, '')}]`;
                }
                if (cell.style.fontSize) {
                    const size = cell.style.fontSize.replace('em', '');
                    bbcode += `[SIZE=${size}]`;
                }
                if (cell.style.fontWeight === 'bold') {
                    bbcode += '[B]';
                }
                if (cell.style.fontStyle === 'italic') {
                    bbcode += '[I]';
                }
                if (cell.style.textDecoration.includes('underline')) {
                    bbcode += '[U]';
                }

                // Add content
                bbcode += cellContent;

                // Close tags in reverse order
                if (cell.style.textDecoration.includes('underline')) {
                    bbcode += '[/U]';
                }
                if (cell.style.fontStyle === 'italic') {
                    bbcode += '[/I]';
                }
                if (cell.style.fontWeight === 'bold') {
                    bbcode += '[/B]';
                }
                if (cell.style.fontSize) {
                    bbcode += '[/SIZE]';
                }
                if (cell.style.fontFamily) {
                    bbcode += '[/FONT]';
                }
                if (cell.style.color) {
                    bbcode += '[/COLOR]';
                }

                // Close TD tag
                bbcode += '[/TD]\n';
            });
            bbcode += '  [/TR]\n';
        });

        bbcode += '[/TABLE]';
        bbcodeOutput.value = bbcode;
    }

    function rgbToHex(rgb) {
        if (!rgb) return '#000000';
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues) return '#000000';
        return `#${rgbValues.map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
    }


    // Event listeners
    rowsInput.addEventListener('input', createTable);
    colsInput.addEventListener('input', createTable);
    borderInput.addEventListener('input', createTable);
    borderColorInput.addEventListener('input', createTable);
    widthInput.addEventListener('input', createTable);

    textColorInput.addEventListener('input', updateCellStyles);
    bgColorInput.addEventListener('input', updateCellStyles);
    cellFontSelect.addEventListener('change', updateCellStyles);
    cellSizeSelect.addEventListener('change', updateCellStyles);
    cellBoldCheckbox.addEventListener('change', updateCellStyles);
    cellItalicCheckbox.addEventListener('change', updateCellStyles);
    cellUnderlineCheckbox.addEventListener('change', updateCellStyles);

    headerTextColorInput.addEventListener('input', updateCellStyles);
    headerBgColorInput.addEventListener('input', updateCellStyles);
    headerFontSelect.addEventListener('change', updateCellStyles);
    headerSizeSelect.addEventListener('change', updateCellStyles);
    headerBoldCheckbox.addEventListener('change', updateCellStyles);
    headerItalicCheckbox.addEventListener('change', updateCellStyles);
    headerUnderlineCheckbox.addEventListener('change', updateCellStyles);

    generateButton.addEventListener('click', generateBBCode);

    // Initial setup
    populateSelectOptions();
    createTable();
});
