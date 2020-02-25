pragma solidity ^0.5.0;

contract BookAppointment{
    //appointment is the ERC 721 token
    uint public apptCost;
    address payable admin;

    constructor() public {
        admin = msg.sender; 
        apptCost = 10;
        
    }
    
    

    event AppointmentConfirm(uint appointmentId, uint appointmentDate, uint appointmentTime );
    //event AppointmentCancelled(uint appointmentId, uint appointmentDate, uint appointmentTime);
    struct Appointment {
        uint apptDate ;
        uint apptTime ;
    }

    Appointment[] public appointments;

    mapping (uint => address payable) public apptToPatient;
    mapping (address => uint) public patientApptCount;

    

    function _createAppointment( uint _apptDate, uint _apptTime) internal {
        
        uint id = appointments.push(Appointment(_apptDate , _apptTime));
        apptToPatient[id] = msg.sender;
        patientApptCount[msg.sender]++;
        emit AppointmentConfirm(id, _apptDate, _apptTime);
    }  


    function createAppointment( uint _apptDate, uint _apptTime) public payable {
        require( _apptDate != 0 );
        require(_apptTime != 0);
        require(patientApptCount[msg.sender] == 0);
        require(msg.value == apptCost);
        require(msg.sender != address(0));
        _createAppointment(_apptDate, _apptTime);
    }
    
    function receiveEther() public {
        require(msg.sender == admin);
        admin.transfer(address(this).balance);
    }

    function cancelAppointment(uint _id) public {
        
        //Appointment memory _appointment = appointments[_id];
        
        address payable _patient = apptToPatient[_id];
        
        require(patientApptCount[msg.sender] == 1);
        require(apptToPatient[_id] == msg.sender);   
        patientApptCount[msg.sender] = 0;
        
        
        
        _patient.transfer(apptCost);
        delete apptToPatient[_id];
        //emit AppointmentCancelled(_id,_appointment.apptDate,_appointment.apptTime);
    }
}  