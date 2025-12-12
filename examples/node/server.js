const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

// Path to Nexus Binary
const NEXUS_BIN = 'nexus';

app.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({error: "Missing 'q' parameter"});

    console.log(`Searching for: ${query}`);

    // Spawn Nexus process
    // nexus @google search "query" --json
    const nexus = spawn(NEXUS_BIN, ['@google', 'search', query, '--json']);

    let output = '';
    let error = '';

    nexus.stdout.on('data', (data) => {
        output += data.toString();
    });

    nexus.stderr.on('data', (data) => {
        error += data.toString();
    });

    nexus.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({error: "Nexus failed", details: error});
        }
        try {
            const json = JSON.parse(output);
            res.json(json);
        } catch (e) {
            res.json({raw: output});
        }
    });
});

app.listen(port, () => {
    console.log(`Nexus Proxy Server listening on port ${port}`);
    console.log(`Try: http://localhost:${port}/search?q=golang`);
});
