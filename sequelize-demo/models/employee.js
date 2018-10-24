
module.exports = (sequelize, DataTypes) => {
    var Employee = sequelize.define("Employee", {
        EmpId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        EmpName: {
            type: DataTypes.STRING(50),
            allowNUll: true
        },
        Salary: {
            type: DataTypes.DECIMAL(18, 0),
            allowNull: false
        },
        Address: {
            type: DataTypes.STRING(50),
            allowNUll: true
        },
    }, {
            timestamps: false,

        });

    Employee.associate = (models) => {
        Employee.hasOne(models.EmployeeDepartment,{
            foreignKey:'EmpId'
        })
    }

    return Employee;
}