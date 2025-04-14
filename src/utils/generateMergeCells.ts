export function generateMergeCells(data: any[], colIndex: number = 0) {
  const mergeCells = [];
  let startRow = 0;
  let currentValue = data[0]?.[colIndex];

  for (let row = 1; row <= data.length; row++) {
    const value = data[row]?.[colIndex];
    if (row === data.length || value !== currentValue) {
      const rowspan = row - startRow;
      if (rowspan > 1) {
        mergeCells.push({
          row: startRow,
          col: colIndex,
          rowspan,
          colspan: 1,
        });
      }
      startRow = row;
      currentValue = value;
    }
  }

  return mergeCells;
}
