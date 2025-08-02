import express from 'express';
import multer from 'multer';

const app = express();
app.use(express.json());

app.post('/api/sync-room', (req, res) => {
    console.log('📥 Room synced:', req.body.name);
    res.status(200).send('Room received');
});

const upload = multer();
app.post('/api/sync-image', upload.single('image'), (req, res) => {
    console.log('📷 Image for room:', req.body.roomId);
    res.status(200).send('Image received');
});

app.listen(3001, () => console.log('Server on http://localhost:3001'));
