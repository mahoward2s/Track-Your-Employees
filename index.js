const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    // Your MYSQL PASSWORD here
    password: '',
    database: 'employee_trackerDB',
});
//Connection
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
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    runTrackYourEmployees();
};

//-----------------------View Roles-------------------
const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    runTrackYourEmployees();
};

//-----------------------View Employees-------------------
const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    runTrackYourEmployees();
};

//--------------Add Department-----------------------------------
const addDepartment = () => {
    inquirer
        .prompt({
            type: 'input',
            name: 'addDepartment',
            message: 'What DEPARTMENT would you like to add?',
        })
        .then((res) => {
            connection.query('INSERT INTO department SET ?',
                {
                    name: res.addDepartment
                },
                (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    runTrackYourEmployees();
                }
            );
        });
};

//------------------------Add Role----------------------------------
const addRole = () => {
    connection.query('SELECT role.title AS Title, role.salary AS Salary FROM role', (err, res) => {
        inquirer
            .prompt([{
                type: 'input',
                name: 'roleTitle',
                message: 'What is the TITLE of the role?'
            }, {
                type: 'input',
                name: 'Salary',
                message: 'What is the SALARY of the role?',
            }
            ]).then((res) => {
                connection.query('INSERT INTO role SET ?',
                    {
                        title: res.roleTitle,
                        salary: res.Salary,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        runTrackYourEmployees();
                    }
                );
            });
    })
};
//------------------------Functions for adding Employee--------------

//-------------------------Add Employee------------------------------
const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstname',
                message: 'Enter first name of employee'
            },
            {
                type: 'input',
                name: 'lastname',
                message: 'Enter last name of employee'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is their role?',
                choices:
            },
            {
                type: 'choice',
                name: 'role',
                message: 'What is their managers name?',
                choices:
            },
        ]).then




    //-------------Quit------------
    const quitConnection = () => {
        if (err) throw err;
        connection.end();
        console.log("You have ended your tracker.")
    };
