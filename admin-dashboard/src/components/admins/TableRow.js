import React from 'react';

const TableRow = ({ row, deleteRow }) => {
  return (
    <tr>
      <td>{row.username}</td>
      <td>{row.password}</td>
      <td>{row.is_staff ? 'Админ' : 'Редактор'}</td>
      <td>
        <button onClick={() => deleteRow(row.id)}>Удалить</button>
      </td>
    </tr>
  );
};

export default TableRow;
