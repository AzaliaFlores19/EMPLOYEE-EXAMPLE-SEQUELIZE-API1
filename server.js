// server.js
const express = require('express');
const { EMPLOYEE } = require('./models'); 
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// GET: Obtener todos los empleados
app.get('/employees', async (req, res) => {
  try {
    const employees = await EMPLOYEE.findAll(); 
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados' });
  }
});

// POST: Crear un nuevo empleado
app.post('/employees', async (req, res) => {
  const { nombre, correo, salario } = req.body;

  if (!nombre || !correo || salario === undefined) {
    return res.status(400).json({ message: 'Los campos "nombre", "correo" y "salario" son obligatorios' });
  }

  try {
    const nuevoEmpleado = await EMPLOYEE.create({ nombre, correo, salario });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el empleado' });
  }
});

// PUT: Actualizar un empleado por ID
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, salario } = req.body;

  try {
    const employee = await EMPLOYEE.findByPk(id); 
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    employee.nombre = nombre || employee.nombre;
    employee.correo = correo || employee.correo;
    employee.salario = salario !== undefined ? salario : employee.salario;

    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el empleado' });
  }
});

// DELETE: Eliminar un empleado por ID
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await EMPLOYEE.findByPk(id); 
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await employee.destroy();
    res.json({ message: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado' });
  }
});


app.listen(port, () => {
  console.log(`API en http://localhost:${port}`);
});
