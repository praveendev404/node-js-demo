module.exports = (sequelize, DataTypes) => {
    return sequelize.define('EmployeeDepartment', {

        EmpId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        Department: DataTypes.STRING
    }, {
            timestamps: false
        })
}