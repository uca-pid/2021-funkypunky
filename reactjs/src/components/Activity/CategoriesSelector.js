import React, {useState, useEffect} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

const categories = [
  'Correr',
  'Caminar',
  'Ciclismo',
  'Natacion',
  'Libre'
];

const CategoriesSelector = ({data, setData, filteredData, setFilteredData}) => {
  const [categoriesSelected, setCategoriesSelected] = useState([]);

  const handleChange = async (event) => {
    setCategoriesSelected(event.target.value);
    await setFilteredData(data);
        console.log(filteredData, ' filtered dataaaa 1')

    const aux = filteredData.filter(registro => event.target.value.includes(registro.categoria.nombre));
    setFilteredData(aux);
    console.log(filteredData, ' filtered dataaaa 2')
  };

  return (
    <div>
      <FormControl sx={{ m: 2, minWidth: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Filtrar por deporte</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={categoriesSelected}
          onChange={handleChange}
          input={<OutlinedInput label="Filtrar por deporte" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              <Checkbox checked={categoriesSelected.indexOf(category) > -1} />
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default CategoriesSelector;