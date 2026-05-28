import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// Lấy Key từ két sắt bí mật của Render (TUYỆT ĐỐI KHÔNG GHI RÕ KEY Ở ĐÂY NỮA)
const apiKey = process.env.GEMINI_API_KEY;

app.post('/api/chat', async (req, res) => {
    try {
        if (!apiKey) throw new Error("Chưa cấu hình GEMINI_API_KEY trên máy chủ!");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const { promptText } = req.body;
        if (!promptText) return res.status(400).json({ success: false, error: "Thiếu câu hỏi" });

        const result = await model.generateContent(promptText);
        res.json({ success: true, result: result.response.text() });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Cloud Render bắt buộc phải dùng cổng động (process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ AI Server Cloud đang chạy ở Port ${PORT}`));
