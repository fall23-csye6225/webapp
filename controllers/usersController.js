const fs = require('fs');
const bcrypt = require('bcrypt');


//const Users = db.users;
//const Assignments = db.assignments;


// const addUser = async (req, res) => {
//     let info = {
//         first_name: 
//     }
// }/Users/srushtyr/Desktop/assignment_3_cloud/webapp/opt/users.csv

//async function run(Users){
//     //console.log('abc', Users);
//     const fileContent = await fs.readFileSync('./opt/users.csv','utf-8');
//     //console.log('fileContent:', fileContent);
//     const lines = fileContent.split("\n");
//     //console.log('lines:', lines);
//     const dataLines = lines.slice(1, lines.length).filter(line => line.trim() !== '');
//     //console.log('datalines:',lines.length);
//     const users = [];
//     await Users.truncate();
//     const salt = await bcrypt.genSalt(10);

//     // dataLines.forEach((dataLines) => {
//     //     const columns = dataLines.split(",");
//     //     const value = await bcrypt.hash(columns[3],salt);
//     //     let user = {
//     //         first_name: columns[0],
//     //         last_name: columns[1],
//     //         email: columns[2],
//     //         password: value
//     //     }
//     //     users.push(user);
//     // });

    
//     const hashedPasswords = dataLines.map(async (dataLine) => {
//         const columns = dataLine.split(",");
//         const value = await bcrypt.hash(columns[3], salt);
//         return {
//             first_name: columns[0],
//             last_name: columns[1],
//             email: columns[2],
//             password: value
//         };
//     });

//     const hashedUsers = await Promise.all(hashedPasswords);


//     try{
//         let result = await Users.bulkCreate(hashedUsers);
//         //console.log('Result:', users);
//         let generatedIds = result.map(el => el.dataValues.id);
//         console.log('generatedIds', generatedIds);
//     } catch(e){
//         console.error(e);
//     }
// }

async function run(Users) {
    try {
        const fileContent = await fs.readFileSync('./opt/users.csv','utf-8');
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