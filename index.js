import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, CssBaseline } from "@mui/material";
import axios from "axios";
import "./App.css";

// Define Custom Theme
const customTheme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc3545" },
    background: { default: "#f4f4f4", paper: "#fff" },
  },
  typography: { fontFamily: "Arial, sans-serif", fontSize: 14 },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: { borderRadius: "8px", backgroundColor: "#fff", padding: "10px" },
        columnHeaders: { backgroundColor: "#1976d2", color: "#fff", fontSize: "16px" },
      },
    },
  },
});

function DataGridTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newRow, setNewRow] = useState({ name: "", age: "", email: "" });

  useEffect(() => {
    const savedData = localStorage.getItem("dataGridRows");
    if (savedData) {
      setRows(JSON.parse(savedData));
      setFilteredRows(JSON.parse(savedData));
    } else {
      axios.get("https://jsonplaceholder.typicode.com/users").then((response) => {
        const formattedData = response.data.map((user) => ({
          id: user.id,
          name: user.name,
          age: Math.floor(Math.random() * 40) + 20, // Random Age
          email: user.email,
        }));
        setRows(formattedData);
        setFilteredRows(formattedData);
        localStorage.setItem("dataGridRows", JSON.stringify(formattedData));
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dataGridRows", JSON.stringify(rows));
    handleSearch(searchQuery);
  }, [rows]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredRows(rows);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(lowerQuery) ||
        row.email.toLowerCase().includes(lowerQuery) ||
        row.age.toString().includes(lowerQuery)
    );
    setFilteredRows(filtered);
  };

  const handleEditCellChange = (params) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === params.id ? { ...row, [params.field]: params.value } : row))
    );
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    if (newRow.name && newRow.age && newRow.email) {
      const updatedRows = [...rows, { id: Date.now(), ...newRow }];
      setRows(updatedRows);
      setFilteredRows(updatedRows);
      setNewRow({ name: "", age: "", email: "" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "age", headerName: "Age", width: 100, type: "number", editable: true },
    { field: "email", headerName: "Email", width: 200, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={() => handleDelete(params.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box className="data-grid-container">
        <h2>Search & Sort Data Grid</h2>

        {/* Search Input */}
        <TextField
          label="Search by Name, Email, or Age"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />

        {/* New Row Input Fields */}
        <Box className="input-container">
          <TextField
            label="Name"
            variant="outlined"
            value={newRow.name}
            onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
          />
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            value={newRow.age}
            onChange={(e) => setNewRow({ ...newRow, age: e.target.value })}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={newRow.email}
            onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddRow}>
            Add Row
          </Button>
        </Box>

        {/* Data Grid */}
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
          onCellEditCommit={handleEditCellChange}
        />
      </Box>
    </ThemeProvider>
  );
}export default DataGridTable;