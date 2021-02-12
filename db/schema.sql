DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NULL,
    salary DECIMAL NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR (30) NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    PRIMARY KEY (id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

--left join department table with role table and left join employee table
/* SELECT *
FROM department
LEFT join role
ON department.id = role.department_id
LEFT join employee
ON role.id = employee.role_id; */


SELECT employee.id as ‘ID’, employee.first_name as ‘First Name’, employee.last_name as ‘Last Name’, role.title as ‘Position’, department.name as ‘Department’, role.salary as ‘Salary’, CONCAT(m.first_name, ' ’, m.last_name) as ‘Manager’ 
FROM employee 
LEFT JOIN employee m 
ON m.id = employee.manager_id 
JOIN role 
ON employee.role_id = role.id 
JOIN department 
ON role.department_id = department.id;
