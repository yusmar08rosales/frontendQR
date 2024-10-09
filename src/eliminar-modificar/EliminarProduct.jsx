import React, { useState } from "react";
import Swal from "sweetalert2";
import { Modal, InputLabel, Button, Box, TextField, InputAdornment } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const EliminarProduct = ({ lote }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userName = userInfo?.user;

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // validacion antes de abrir componente
    const handleOpen = () => {
        Swal.fire({
            title: '¿Estás seguro que quieres modificar el archivo del producto?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, modificar!'
        }).then((result) => {
            if (result.isConfirmed) {
                setOpen(true);
            }
        });
    };

    const handleClose = () => setOpen(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            Swal.fire('Error', 'Por favor selecciona un archivo', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('documento', selectedFile);
        formData.append('lote', lote);
        formData.append('userName', userName);

        try {
            const response = await fetch(`https://backendpaginaqr-production.up.railway.app/ModificarProduct/${lote}/${userName}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

            Swal.fire('Éxito', 'Archivo subido correctamente', 'success');
            handleClose();
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            Swal.fire('Error', 'Hubo un problema al subir el archivo', 'error');
        }
    };

    return (
        <>
            <div>
                <CreateIcon onClick={handleOpen} style={{ cursor: 'pointer' }} />

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <div className="file-upload">
                            <InputLabel htmlFor="upload-file" id="title">Subir archivo</InputLabel>
                            <TextField
                                type="file"
                                inputProps={{ accept: ".json, .csv" }}
                                fullWidth
                                color="primary"
                                id="archivo"
                                onChange={handleFileChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CloudUploadIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileUpload}
                        >
                            Subir Archivo
                        </Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default EliminarProduct;
