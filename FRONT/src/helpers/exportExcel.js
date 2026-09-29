export const exportToExcel = (data, columns, fileName = "export.xls") => {
  // Filtrar columnas que no deben descargarse (action) y que tienen download: false
  const columnsToExport = columns.filter((col) => {
    // Excluir columna action
    if (col.name === "action") return false;
    // Excluir columnas que explícitamente tienen download: false
    if (col.options && col.options.download === false) return false;
    return true;
  });

  const tableHeader = columnsToExport
    .map((col) => `<th>${col.label || col.name}</th>`)
    .join("");

  const tableRows = data
    .map((row) => {
      const cells = columnsToExport
        .map((col) =>{ 
          return `<td>${row[col.name] ?? ""}</td>`
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const htmlTable = `
    <!DOCTYPE html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <table border="1">
          <thead><tr>${tableHeader}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlTable], {
    type: "application/vnd.ms-excel",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
};
