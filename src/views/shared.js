export default {
    transform: function(apiResult) {
        const rows = [];
        const rawRows = apiResult.values || [];
        const headers = rawRows.shift();
          rawRows.forEach((row) => {
          const rowData = {};
          row.forEach((item, index) => {
          rowData[headers[index]] = item;
        });
        rows.push(rowData);
        });
        return rows;

    }
}