import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Kích hoạt áo giáp đọc file .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Tự động lấy Key từ môi trường (An toàn tuyệt đối)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        // Dùng ĐÚNG model 2.5 đã check
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const { promptText } = req.body;
        
        const result = await model.generateContent(promptText);
        res.json({ success: true, result: result.response.text() });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Render.com sẽ tự cấp Port, nếu chạy Local thì dùng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ AI Server chạy ở Port ${PORT}`));