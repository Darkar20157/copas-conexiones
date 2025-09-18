import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    TextField,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Roulette } from "../../interfaces/Roulette";
import {
    getRoulettes,
    createRoulette,
    updateRoulette,
    deleteRoulette,
} from "../../api/RouletteService";

// 🔹 Modal separado con estilos
const RouletteFormModal = React.memo(
    ({
        open,
        onClose,
        onSave,
        initialData,
    }: {
        open: boolean;
        onClose: () => void;
        onSave: (data: { name: string; description: string }) => void;
        initialData?: { name: string; description: string };
    }) => {
        const [form, setForm] = useState({ name: "", description: "" });

        useEffect(() => {
            if (initialData) {
                setForm(initialData);
            } else {
                setForm({ name: "", description: "" });
            }
        }, [initialData, open]);

        return (
            <Dialog
                open={open}
                onClose={onClose}
                slots={{ paper: Paper }}
                slotProps={{
                    paper: {
                        sx: {
                            background: "linear-gradient(135deg, #4b002d, #3b005e)",
                            color: "var(--color-card-foreground)",
                            borderRadius: "20px",
                            boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
                            p: 2,
                            transition: "all 0.3s ease-in-out",
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold", color: "white" }}>
                    {initialData ? "Editar opción" : "Nueva reto"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "rgba(255,255,255,0.3)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                    boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                                },
                                "& input": {
                                    color: "#fff", // 👈 texto blanco
                                },
                                "& textarea": {
                                    color: "#fff", // 👈 para multilínea
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#fff",
                            },
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        value={form.description}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "rgba(255,255,255,0.3)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                    boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                                },
                                "& input": {
                                    color: "#fff", // 👈 texto blanco
                                },
                                "& textarea": {
                                    color: "#fff", // 👈 para multilínea
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#fff",
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} sx={{ color: "white" }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onSave(form)}
                        variant="contained"
                        sx={{
                            backgroundColor: "var(--burgundy-600)",
                            "&:hover": { backgroundColor: "var(--burgundy-700)" },
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
);


export const ConfigureRoulette = () => {
    const [options, setOptions] = useState<Roulette[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Roulette | null>(null);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const res = await getRoulettes();
            if (res.success) {
                setOptions(res.content?.data ?? []);
            }
        } catch (err) {
            console.error("Error al obtener opciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = useCallback(
        async (data: { name: string; description: string }) => {
            try {
                if (editing) {
                    await updateRoulette(editing.id, data);
                } else {
                    await createRoulette(data);
                }
                fetchOptions();
                handleClose();
            } catch (err) {
                console.error("Error al guardar:", err);
            }
        },
        [editing]
    );

    const handleDelete = async (id: number) => {
        try {
            await deleteRoulette(id);
            fetchOptions();
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    const handleOpen = (option?: Roulette) => {
        if (option) {
            setEditing(option);
        } else {
            setEditing(null);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "name", headerName: "Nombre", flex: 1 },
        { field: "description", headerName: "Descripción", flex: 2 },
        {
            field: "actions",
            headerName: "Acciones",
            width: 200,
            renderCell: (params: { row: Roulette }) => (
                <Box>
                    <Button
                        size="small"
                        onClick={() => handleOpen(params.row)}
                        sx={{
                            mr: 1,
                            backgroundColor: "var(--purple-500)",
                            color: "white",
                            "&:hover": { backgroundColor: "var(--purple-600)" },
                        }}
                    >
                        Editar
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{
                            backgroundColor: "var(--destructive)",
                            color: "white",
                            "&:hover": { backgroundColor: "var(--burgundy-700)" },
                        }}
                    >
                        Eliminar
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Button
                variant="contained"
                onClick={() => handleOpen()}
                sx={{
                    mb: 2,
                    backgroundColor: "var(--burgundy-600)",
                    "&:hover": { backgroundColor: "var(--burgundy-700)" },
                }}
            >
                Agregar Opción
            </Button>

            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={options}
                    columns={columns}
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    loading={loading}
                    disableRowSelectionOnClick
                    sx={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",

                        // 🔹 Header (forzado)
                        "& .MuiDataGrid-columnHeaders": {
                            background: "linear-gradient(90deg, var(--burgundy-600), var(--purple-600)) !important",
                            color: "white !important",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            borderBottom: "1px solid var(--border)",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            background: "transparent !important",
                            color: "white !important",
                        },

                        // 🔹 Celdas
                        "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid var(--border)",
                            color: "white",
                        },

                        // 🔹 Hover filas
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                        },

                        // 🔹 Footer / paginación
                        "& .MuiTablePagination-root": {
                            color: "white",
                        },
                    }}
                />

            </div>

            {/* Modal estilizada */}
            <RouletteFormModal
                open={open}
                onClose={handleClose}
                onSave={handleSave}
                initialData={editing ? { name: editing.name, description: editing.description } : undefined}
            />
        </Box>
    );
};
