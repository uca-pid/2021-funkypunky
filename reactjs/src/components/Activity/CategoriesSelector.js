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
  'Nadar'
];

const CategoriesSelector = () => {
  const [categoriesSelected, setCategoriesSelected] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoriesSelected(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
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