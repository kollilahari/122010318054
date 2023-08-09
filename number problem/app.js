const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid URLs provided' });
    }

    const uniqueNumbers = new Set();

    try {
        const promises = urls.map(async url => {
            try {
                const response = await axios.get(url, { timeout: 2000 }); // Adjust timeout as needed
                const data = response.data;
                if (data && data.numbers) {
                    data.numbers.forEach(number => uniqueNumbers.add(number));
                }
            } catch (error) {
                console.error(`Error fetching numbers from ${url}: ${error.message}`);
            }
        });

        await Promise.all(promises);

        const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
        return res.json({ numbers: sortedNumbers });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
