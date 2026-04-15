const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 1. تحديد الصفحة التي سيراها الموظف أو العميل
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. البدء في مراقبة "الاتصالات الجديدة"
io.on('connection', (socket) => {
    console.log('هناك شخص دخل إلى المحادثة الآن! ✅');

    // عندما يرسل شخص رسالة
    socket.on('chat message', (msg) => {
        console.log('رسالة جديدة: ' + msg);
        // إرسال الرسالة لكل الموجودين في الشات
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('شخص غادر المحادثة ❌');
    });
});

// 3. تشغيل السيرفر على جهازك
http.listen(3000, () => {
    console.log('نظام المحادثة يعمل الآن على: http://localhost:3000');
});