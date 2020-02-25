//set up: define inital state
//act: where we actually test the code
//assert: check the results

const BookAppointment = artifacts.require("BookAppointment");
require('chai')
.use(require('chai-as-promised'))
.should();

//creating appointment requires us to oass date and time

const Appt1 = [1212,1210];



//Three tests:
//should be able to charge appointment cost
//should not allow two appointments
// only owner should be able to do that
// should create appointment
// Owner should get the money



contract("BookAppointment", (accounts) => {
    let [deployer,patient1,patient2 ] = accounts;

    let contractInstance;
    
    beforeEach(async () =>{
        contractInstance = await BookAppointment.deployed()
    })

    describe("Correct deployment", async () =>{
        it("should return appointment Cost", async () => {
            //const contractInstance = await BookAppointment.deployed();
            const result = await contractInstance.apptCost();
            const address = await BookAppointment.address;
            assert.equal(result , 10 );
            assert.notEqual(address,0x0);
            assert.notEqual(address,"");
            assert.notEqual(address,null);
            assert.notEqual(address,undefined);
            //assert.equal(result.appointments[1], Appt1);
        })
    })

    describe('Creating and Cancelling Appointments', async () => {

        //don't forget to add await in front of contract instance or it won't read the event

        it("should create appointment if everything is right", async () => {
            result = await contractInstance.createAppointment( 1212, 1210, {from: patient1, value: 10});
            const event = result.logs[0].args;
            // id pushes starts with 1. go to remix to check
            assert.equal(event.appointmentId.toNumber(), 1,"appointment Id is right");
            //ask for contract instance use
            assert.equal(event.appointmentDate.toNumber(), 1212,"appt Date is right!");
            assert.equal(event.appointmentTime.toNumber(), 1210, "appointment time is right")
        })

        it("appointments should cancel with insufficient cost", async () => {
            //used patient2 because patient 1 already created the appointment in result above
            // using patient2 so that value can be checked
            await contractInstance.createAppointment( 1212, 1210, {from: patient2, value: 1}).should.be.rejected;
                    })
        
        it("Booking appointment twice should be rejected", async () => {
            //booking = await contractInstance.createAppointment(1212,1210, {from:patient,value: 10});
            await contractInstance.createAppointment(1212,1210, {from: patient1,value: 10}).should.be.rejected;

        }) 
        // use x in front of "it" to make it pending

        it("should be able to cancel only your own appointment", async () => {
            patientOldBalance = await web3.eth.getBalance(patient1);
            await contractInstance.cancelAppointment(1, {from: patient2}).should.be.rejected;
            cancel = await contractInstance.cancelAppointment(1, {from: patient1});

        // why cancel is false?    
            assert.equal(cancel.receipt.status, true);
        })

        it("check if cancelled", async() => {
            count = await contractInstance.patientApptCount(patient1);
            assert.equal(count,0);

            patientNewBalance = await web3.eth.getBalance(patient1);
            const gasUsed = cancel.receipt.gasUsed;
            const expectedBalance = patientOldBalance + contractInstance.apptCost()-gasUsed;

            assert.equal(expectedBalance,patientNewBalance);

        })
    })
    
    
    
})