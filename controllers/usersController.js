const fs = require('fs');
const bcrypt = require('bcrypt');



async function run(Users) {
    try {
        const fileContent = await fs.readFileSync('./opt/user.csv','utf-8');
        const lines = fileContent.split("\n");
        const dataLines = lines.slice(1, lines.length).filter(line => line.trim() !== '');

        const existingEmails = await Users.findAll({ attributes: ['email'] });
        const existingEmailSet = new Set(existingEmails.map(user => user.email));

        const usersToInsert = [];

        const salt = await bcrypt.genSalt(10);

        for (const dataLine of dataLines) {
            const columns = dataLine.split(",");
            const email = columns[2];

            if (!existingEmailSet.has(email)) {
                const hashedPassword = await bcrypt.hash(columns[3], salt);
                const user = {
                    first_name: columns[0],
                    last_name: columns[1],
                    email,
                    password: hashedPassword
                };
                usersToInsert.push(user);
            }
        }

        if (usersToInsert.length > 0) {
            await Users.bulkCreate(usersToInsert);
            console.log('Users added successfully.');
        } else {
            console.log('No new users to add.');
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = run;