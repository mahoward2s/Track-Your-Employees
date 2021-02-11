const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: '',
    database: 'employee_trackerDB',
});
// Need to make changes to inquire here to..........and to the remaining code........
connection.connect((err) => {
    if (err) throw err;
    runTrackYourEmployees();
});

const runTrackYourEmployees = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View Departments',
                'View Roles',
                'View Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employees',
                'Quit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View Departments':
                    viewDepartments();
                    break;

                case 'View Roles':
                    viewRoles();
                    break;

                case 'View Employees':
                    viewEmployees();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee':
                    updateEmployee();
                    break;

                case 'Quit':
                    quitConnection();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};

//-----------------------View Departments-------------------
const viewDepartments = () => {
    console.log('Selecting all departments...\n');
    connection.query('', (err, res) => {
        if (err) throw err;
        console.log(res);
    })
    runTrackYourEmployees();
};


const readProducts = () => {
    console.log('Selecting all Top Songs...\n');
    connection.query('SELECT * FROM top_songs', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
};


const artistSearch = () => {
    inquirer
        .prompt({
            name: 'artist',
            type: 'input',
            message: 'What artist would you like to search for?',
        })
        .then((answer) => {
            const query = 'SELECT position, song, year FROM top5000 WHERE ?';
            connection.query(query, { artist: answer.artist }, (err, res) => {
                res.forEach(({ position, song, year }) => {
                    console.log(
                        `Position: ${position} || Song: ${song} || Year: ${year}`
                    );
                });
                runTrackYourEmployees();
            });
        });
};

const multiSearch = () => {
    const query =
        'SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1';
    connection.query(query, (err, res) => {
        res.forEach(({ artist }) => console.log(artist));
        runTrackYourEmployees();
    });
};

const rangeSearch = () => {
    inquirer
        .prompt([
            {
                name: 'start',
                type: 'input',
                message: 'Enter starting position: ',
                validate(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
            {
                name: 'end',
                type: 'input',
                message: 'Enter ending position: ',
                validate(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
        ])
        .then((answer) => {
            const query =
                'SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?';
            connection.query(query, [answer.start, answer.end], (err, res) => {
                res.forEach(({ position, song, artist, year }) => {
                    console.log(
                        `Position: ${position} || Song: ${song} || Artist: ${artist} || Year: ${year}`
                    );
                });
                runTrackYourEmployees();
            });
        });
};

const songSearch = () => {
    inquirer
        .prompt({
            name: 'song',
            type: 'input',
            message: 'What song would you like to look for?',
        })
        .then((answer) => {
            console.log(answer.song);
            connection.query(
                'SELECT * FROM top5000 WHERE ?',
                { song: answer.song },
                (err, res) => {
                    if (res[0]) {
                        console.log(
                            `Position: ${res[0].position} || Song: ${res[0].song} || Artist: ${res[0].artist} || Year: ${res[0].year}`
                        );
                    } else {
                        console.error(`No results for ${answer.song}`);
                    }
                    runTrackYourEmployees();
                }
            );
        });
};

const songAndAlbumSearch = () => {
    inquirer
        .prompt({
            name: 'artist',
            type: 'input',
            message: 'What artist would you like to search for?',
        })
        .then((answer) => {
            let query =
                'SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ';
            query +=
                'FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ';
            query +=
                '= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position';

            connection.query(query, [answer.artist, answer.artist], (err, res) => {
                console.log(`${res.length} matches found!`);
                res.forEach(({ year, position, artist, song, album }, i) => {
                    const num = i + 1;
                    console.log(
                        `${num} Year: ${year} Position: ${position} || Artist: ${artist} || Song: ${song} || Album: ${album}`
                    );
                });

                runTrackYourEmployees();
            });
        });
};

//-------------Quit------------
const quitConnection = () => {
    if (err) throw err;
    connection.end();
};
