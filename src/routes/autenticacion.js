const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Lista de cadenas genéricas prohibidas
const forbiddenStrings = ["password", "1234", "qwerty", "pepitas"]; 

router.post('/registro', [
  // 1. Validar Nombre
  body('nombre')
    .trim() // Elimina espacios al principio y al final
    .notEmpty().withMessage('El nombre no puede estar en blanco'),

  // 2. Validar Apellido
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido no puede estar en blanco'),

  // 3. Validar Email
  body('email')
    .trim()
    .notEmpty().withMessage('El email no puede estar en blanco')
    .isEmail().withMessage('El formato del email no es válido')
    .normalizeEmail(), // Limpia el formato del email (ej. minúsculas)

  // 4. Validar Contraseña (Contiene todas las reglas del user story)
  body('password')
    .trim()
    .notEmpty().withMessage('La contraseña no puede estar en blanco')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-zA-Z]/).withMessage('La contraseña debe incluir al menos una letra')
    .matches(/[0-9]/).withMessage('La contraseña debe incluir al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe incluir al menos un carácter especial')
    
    // Validación personalizada para cadenas prohibidas, email y nombre de usuario
    .custom((value, { req }) => {
      const passwordLower = value.toLowerCase();
      const emailLower = (req.body.email || '').toLowerCase();
      const nombreLower = (req.body.nombre || '').toLowerCase();

      // No debe ser igual al email
      if (passwordLower === emailLower) {
        throw new Error('La contraseña no puede ser igual al email');
      }

      // No debe contener el nombre del usuario
      if (nombreLower && passwordLower.includes(nombreLower)) {
        throw new Error('La contraseña no puede contener tu nombre');
      }

      // No debe contener cadenas prohibidas genéricas
      const containsForbidden = forbiddenStrings.some(str => passwordLower.includes(str));
      if (containsForbidden) {
        throw new Error('La contraseña contiene términos demasiado comunes o inseguros');
      }

      return true; // Si pasa todo, la validación es exitosa
    }),
  body('passwordConfirm')
    .trim()
    .notEmpty().withMessage('La confirmación de contraseña es obligatoria')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })

], (req, res) => {
  
  // RECOLECCIÓN DE ERRORES: Aquí se evalúan los escenarios
  const errors = validationResult(req);
  
  // Escenario 1: El usuario comete errores -> Se evita el envío y se reportan los fallos
  if (!errors.isEmpty()) {
    return res.status(400).render('paginas/registro', {
      errors: errors.array(),
      old: req.body
    });
  }

  // Escenario 2: Todo está correcto -> Se procesa el registro de manera segura
  const { nombre, apellido, email } = req.body;
 
  res.status(201).render('paginas/registro', {
    success: 'Usuario registrado correctamente. Ya puedes iniciar sesión.',
    old: { nombre, apellido, email }
  });
});

module.exports = router;