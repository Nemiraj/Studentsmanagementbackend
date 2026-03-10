const Student = require('../models/Student');

// GET /api/students
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { name:  { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/students/:id
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const student = await Student.create({ name, email, age });
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent };
