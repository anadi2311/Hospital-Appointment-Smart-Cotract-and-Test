const BookAppointment = artifacts.require("BookAppointment");

module.exports = function(deployer) {
  deployer.deploy(BookAppointment);
};
