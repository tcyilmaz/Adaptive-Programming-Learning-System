// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController.js'); // courseController'ın bir obje ve içinde fonksiyonlar olduğunu varsayıyoruz

// TÜM KURS LİSTESİ
router.get('/', courseController.getAllCourses); // DOĞRU! Fonksiyonun referansını veriyorsunuz.

// TEK BİR KURS DETAYI
router.get('/:courseId', courseController.getCourseById); // DOĞRU!

module.exports = router;