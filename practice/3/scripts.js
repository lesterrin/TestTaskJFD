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

    const comparer = (idx, asc) => (a, b) => {
        const v1 = getCellValue(asc ? a : b, idx),
              v2 = getCellValue(asc ? b : a, idx);
        if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) return v1 - v2;
        else return v1.toString().localeCompare(v2);
    };

    const onInputChange = (e, state) => filterData(e.target.value, state);

    const isStrContainsSubstr = (str, subStr) => str.toString().includes(subStr);

    const filterData = (searchStr, state) => {
        let tempArr = [];

        state.data.forEach(row => Object.values(row).forEach(cell => {
            if (isStrContainsSubstr(cell, searchStr)) {
                tempArr = [...tempArr, row];
            }
        }));

        state.configuredData = [...new Set(tempArr)];
    }

    const init = async () => {
        let initialState = {
            data: null,
            configuredData: null,
            tableBody: null
        }

        let validator = {
            set: function (target, key, value) {
                Reflect.set(target, key, value);

                if (key === 'configuredData') {
                    target.tableBody.innerHTML = '';
                    appendRows(target.tableBody, target.configuredData);
                }

                return true;
            }
        };
        //В стейте проходит вся работа с данными. Как только state.configuredData меняется, запускается ререндер
        let state = new Proxy(initialState, validator);

        let response = await fetch('https://jsonplaceholder.typicode.com/posts');
        response = await response.json();

        state.tableBody = document.querySelector('#table tbody');
        state.data = response;
        state.configuredData = response;

        document.querySelector("#search").addEventListener('input', (e) => {
            if (e.target.value.length > 2) onInputChange(e, state);

            if ((e.target.value.length - state.prevInputValLength) < 0 && e.target.value.length < 3) {
                state.configuredData = state.data;
            }

            state.prevInputValLength = e.target.value.length;
        });

        document.querySelectorAll('.col-head').forEach((th, i) => th.addEventListener('click', (() => {
            state.configuredData = [...state.configuredData.sort(comparer(i, this.asc = !this.asc))];
        })));
    };

    init();
});