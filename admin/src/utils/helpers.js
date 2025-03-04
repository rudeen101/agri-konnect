// Utility functions for sorting and filtering
export const sortData = (data, key, order = 'asc') => {
    return data.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  };
  
  export const filterData = (data, query, key) => {
    return data.filter((item) =>
      item[key].toLowerCase().includes(query.toLowerCase())
    );
  };