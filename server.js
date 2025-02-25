require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 代理端点
app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-reasoner",
                messages: req.body.messages
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API Error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('代理错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});