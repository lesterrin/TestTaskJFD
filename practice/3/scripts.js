document.addEventListener("DOMContentLoaded", () => {
    const appendRow = (table, row) => {
        const newRow = table.insertRow();
        newRow.id = `str${row.id}`;
        for (const prop in row) {
            const newCell = newRow.insertCell();
            const newText = document.createTextNode(row[prop]);
            newCell.appendChild(newText);
        }
    }

    const appendRows = (table, data) => data.forEach(el => appendRow(table, el));

    const getCellValue = (tr, idx) => Object.values(tr)[idx];

    const comparer = (idx, asc) => (a, b) => ((v1, v2) => {
            return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
        }
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    const onInputChange = (e) => filterData(e.target.value, state);

    document.querySelector("#search").addEventListener('input', (e) => {
        console.log(e.defaultValue);
        if (/*e.target.value.length > 2*/ true) onInputChange(e);
    });

//попытка сделать аналог редакса
    let state = {
        data: null,
        configuredData: null
    }

    const isStrContainsSubstr = (str, subStr) => str.toString().includes(subStr);

    const filterData = (searchStr, state) => {
        let tempArr = [];

        state.data.forEach(row => Object.values(row).forEach(cell => {
            if (isStrContainsSubstr(cell, searchStr)) {
                tempArr = [...tempArr, row];
            }
        }));

        state.configuredData = [...new Set(tempArr)];

        const tableBody = document.querySelector('#table tbody');
        tableBody.innerHTML = '';
        appendRows(tableBody, state.configuredData);
    }

    const init = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        state = {...state, data: data, configuredData: data};
        const tableBody = document.querySelector('#table tbody');
        appendRows(tableBody, data);

        document.querySelectorAll('.col-head').forEach((th, i) => th.addEventListener('click', (() => {
            state.configuredData = [...state.configuredData.sort(comparer(i, this.asc = !this.asc))];
            tableBody.innerHTML = '';
            appendRows(tableBody, state.configuredData);
        })));
    };

    init();
});