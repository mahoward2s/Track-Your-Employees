const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    // Your MYSQL PASSWORD here
    password: 'Taguchi99',
    database: 'employee_trackerDB',
});
//Connection
connection.connect((err) => {
    if (err) throw err;
    runTrackYourEmployees();
});

const runTrackYourEmployees = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View Employees by Departments',
                    'View Employees by Roles',
                    'View Employees',
                    'View Departments',
                    'Add Department',
                    'View Roles',
                    'Add Role',
                    'Add Employee',
                    'Update Employees',
                    'Quit',
                ],
            }
        ]).then((answer) => {
            switch (answer.action) {
                case 'View Employees by Departments':
                    viewEmployeeDepartments();
                    break;

                case 'View Employees by Roles':
                    viewEmployeeRoles();
                    break;

                case 'View Employees':
                    viewEmployees();
                    break;

                case 'View Departments':
                    viewDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'View Roles':
                    viewRoles();
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
            }
        });
};

//---------------------View Departments-------------------------------
const viewDepartments = () => {
    connection.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err
        console.table(res)
        runTrackYourEmployees()
    })
}

//---------------------View Roles-------------------------------------
const viewRoles = () => {
    connection.query("SELECT * FROM role;", (err, res) => {
        if (err) throw err
        console.table(res)
        runTrackYourEmployees()
    })
}

//-----------------------View Employees by Departments-------------------
const viewEmployeeDepartments = () => {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", (err, res) => {
        if (err) throw err
        console.table(res)
        runTrackYourEmployees()
    })
}

//-----------------------View Employees by Roles-------------------
const viewEmployeeRoles = () => {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", (err, res) => {
        if (err) throw err
        console.table(res)
        runTrackYourEmployees()
    })
};

//-----------------------View Employees-------------------
const viewEmployees = () => {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", (err, res) => {
        if (err) throw err;
        console.table(res)
        runTrackYourEmployees();
    })
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
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}

//-------------------------Add Employee------------------------------
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(val)
                runTrackYourEmployees()
            })

    })
}

//--------------------Update Employee-----------------------------
function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        // console.log(res)
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "lastName",
                type: "rawlist",
                choices: function () {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the Employee's last name? ",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: selectRole()
            },
        ]).then(function (val) {
            var roleId = selectRole().indexOf(val.role) + 1
            connection.query("UPDATE employee SET WHERE ?",
                {
                    last_name: val.lastName

                },
                {
                    role_id: roleId

                },
                function (err) {
                    if (err) throw err
                    console.table(val)
                    startPrompt()
                })

        });
    });

}

/*   //-------------Quit------------
  const quitConnection = () => {
      if (err) throw err;
      connection.end();
      console.log('You have ended TRACKER')
  };*/
