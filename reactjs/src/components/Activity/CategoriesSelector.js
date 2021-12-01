import React, {useState, useEffect, useCallback} from 'react';
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
  'Todas',
  'Correr',
  'Caminar',
  'Ciclismo',
  'Natacion',
  'Libre'
];

const CategoriesSelector = ({data, setData, filteredData, setFilteredData}) => {
  const [categoriesSelected, setCategoriesSelected] = useState("Todas");

  useEffect(()=>{
        setFilteredData(data);
  },[categoriesSelected])
function timeout(ms){
return new Promise((resolve) => setTimeout(resolve, ms));
}
  useEffect(()=>{
  let isCancelled = false;
  const filterData = async () => {
           if(categoriesSelected.length !== 0){
             if(!isCancelled){
                 await setFilteredData(data) && timeout(1000);
                 if(categoriesSelected !== "Todas"){
                  const aux = filteredData.filter(registro => categoriesSelected == registro.categoria.nombre);
                  setFilteredData(aux);
                 }
             }
           }
  }
    filterData();
    return () => {
    isCancelled = true;
    }
  }, [categoriesSelected, filteredData])

  const handleChange = (event) => {
    setCategoriesSelected(event.target.value);
  };

  return (
    <div>
      <FormControl style={{color: 'white'}} sx={{ m: 2, minWidth: 150 }}>
        <InputLabel style={{color: 'white'}} id="demo-multiple-checkbox-label">Filtrar por deporte</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={categoriesSelected}
          onChange={handleChange}
          input={<OutlinedInput label="Filtrar por deporte" />}
          MenuProps={MenuProps}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default CategoriesSelector;