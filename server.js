const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// የ CSV ፋይል አድራሻ
const csvFile = path.join(__dirname, 'students_list.csv');

// ፋይሉ ከሌለ አዲስ መፍጠሪያ
if (!fs.existsSync(csvFile)) {
    fs.writeFileSync(csvFile, 'Full Name, Student ID, Department, Date\n', 'utf8');
}

app.post('/register', upload.single('photo'), (req, res) => {
    // ከ HTML የመጣው ዳታ
    const { name, id, dept } = req.body;
    const date = new Date().toLocaleString();

    if (name && id) {
        const row = `"${name}", "${id}", "${dept}", "${date}"\n`;
        
        // ዳታውን ወደ CSV ፋይሉ መጻፍ
        fs.appendFileSync(csvFile, row, 'utf8');
        
        console.log(`✅ አዲስ ተማሪ ተመዝግቧል፡ ${name}`);
        res.status(200).send("Registration successful!");
    } else {
        console.log("⚠️  ባዶ ዳታ ተልኳል - እባክህ HTML ላይ 'name' attribute መጨመርህን አረጋግጥ");
        res.status(400).send("Missing data");
    }
});

app.listen(3000, () => {
    console.log("------------------------------------------");
    console.log("🚀 ሰርቨሩ በ http://localhost:3000 ላይ ጀመረ");
    console.log(`📊 ዳታው እዚህ ይገባል፡ ${csvFile}`);
    console.log("------------------------------------------");
});