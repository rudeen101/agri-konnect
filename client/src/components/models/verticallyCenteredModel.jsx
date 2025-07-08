import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function VerticallyCenteredModal(props) {
    const [location, setLocation] = React.useState('');

    const handleChange = (event) => {
        setLocation(event.target.value);
    };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Rrequest Delivery
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <ul>
                <li className='d-flex'> 
                    <h6>To: </h6>
                    <p>Agri-Konnect Fulfillment Service </p>
                </li>
                <li className='d-flex'> 
                    <h6>Product: </h6>
                    <p>AgriKonnect </p>
                </li>
            </ul>
            
            <FormControl  className='w-100'>
                <InputLabel id="demo-select-small-label">Location</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={location}
                    label="Location"
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>

                <Box
                component="form"
                className='w-100'
                noValidate
                autoComplete="off"
                >
                    <TextField
                    id="outlined-multiline-static"
                    label="Details"
                    multiline
                    rows={2}
                    defaultValue="Describe your requirements or specifications"
                    className='w-100 mt-3'
                    />
            
                </Box>

                <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />

    </Box>
                <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />

    </Box>

            </FormControl>
        </Modal.Body>

        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
}



export default VerticallyCenteredModal; 