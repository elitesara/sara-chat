const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 1. إعداد بوت الواتساب
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // سيظهر لك كود QR في الـ Terminal هنا
    console.log('سجل دخولك للواتساب عبر مسح الكود التالي:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('بوت الواتساب جاهز لاستقبال إشعارات الشات! ✅');
});

client.initialize();

// 2. إعداد واجهة الشات
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('رسالة من المتجر: ' + msg);
        
        // إرسال تنبيه فوراً لجوالك (استبدل الرقم برقمك بصيغة دولية بدون +)
        const myNumber = "9665xxxxxxxx"; // ضع رقمك هنا
        client.sendMessage(`${myNumber}@c.us`, `📦 عميلة جديدة في المتجر تقول: \n"${msg}"`);
        
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`نظام Elite Sara يعمل على المنفذ ${PORT}`);
});