const User = require("../models/user");
const Group = require("../models/group");
const Workflow = require("../models/workflow");
const Request = require("../models/request");

exports.seedDB = async (req,res) => {
    try{
        await User.deleteMany();
        await Group.deleteMany();
        await Workflow.deleteMany();
        await Request.deleteMany();
        let csehod = await User.register(new User({
            username: "csehod",
            name: "CSE HOD",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let cahod = await User.register(new User({
            username: "cahod",
            name: "CA HOD",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let eeehod = await User.register(new User({
            username: "eeehod",
            name: "EEE HOD",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let ecehod = await User.register(new User({
            username: "ecehod",
            name: "ECE HOD",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        await csehod.save();
        await cahod.save();
        await eeehod.save();
        await ecehod.save();


        let hodGrp = new Group();
        hodGrp.name="HODs";
        hodGrp.members.push(csehod._id);
        hodGrp.members.push(csehod._id);
        hodGrp.members.push(eeehod._id);
        hodGrp.members.push(ecehod._id);

        await hodGrp.save();


        //Deans

        let deanSW = await User.register(new User({
            username: "deansw",
            name: "DEAN SW",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let deanPD = await User.register(new User({
            username: "deanpd",
            name: "DEAN PD",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let deanFW = await User.register(new User({
            username: "deanfw",
            name: "DEAN FW",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        await deanSW.save();
        await deanPD.save();
        await deanFW.save();

        let deanGrp = new Group();
        deanGrp.name="DEANs";
        deanGrp.members.push(deanFW._id);
        deanGrp.members.push(deanSW._id);
        deanGrp.members.push(deanPD._id);

        await deanGrp.save();


        // Faculty advisor

        let faDelta = await User.register(new User({
            username: "fadelta",
            name: "FA Delta",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "0xd6f26DAB93B724EbD822277B07b80F5576685c95",
        }),"12345");

        let faSpider = await User.register(new User({
            username: "faspider",
            name: "FA SPIDER",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let faRMI = await User.register(new User({
            username: "farmi",
            name: "FA RMI",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        await faDelta.save();
        await faRMI.save();
        await faSpider.save();

        let faGrp = new Group();
        faGrp.name="Faculty Advisors";
        faGrp.members.push(faDelta._id);
        faGrp.members.push(faRMI._id);
        faGrp.members.push(faSpider._id);

        await faGrp.save();


        // Wardens
        // Faculty advisor

        let warden1 = await User.register(new User({
            username: "wardenamber",
            name: "Warden Amber",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "0xd6f26DAB93B724EbD822277B07b80F5576685c95",
        }),"12345");

        let warden2 = await User.register(new User({
            username: "wardenaqumarine",
            name: "Warden Aquamarine",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let warden3 = await User.register(new User({
            username: "wardenzircon",
            name: "Warden Zircon",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        await warden1.save();
        await warden2.save();
        await warden3.save();

        let wardenGrp = new Group();
        wardenGrp.name="Hostel Wardens";
        wardenGrp.members.push(warden1);
        wardenGrp.members.push(warden2);
        wardenGrp.members.push(warden3);

        await wardenGrp.save();
        // Workflows

        let workflow1 = new Workflow();
        workflow1.name="Bonafide";
        workflow1.fields.push(...['Name', 'Fathers Name', 'Roll No', 'Degree', 'Department', 'Year', 'Semester']);
        workflow1.approvers.push({
                grp: hodGrp,
                level: 0
        })
        workflow1.approvers.push({
            grp: wardenGrp,
            level: 1
        });
        workflow1.approvers.push({
            grp: deanGrp,
            level: 2
        });

        await workflow1.save();

        let workflow2 = new Workflow();
        workflow2.name="OD";
        workflow2.fields.push(...["Name", "Roll Number", "From Date", "To date", "Reason"]);
        workflow2.approvers.push({
                grp: faGrp._id,
                level: 0
        })
        workflow2.approvers.push({
            grp: deanGrp._id,
            level: 1
        });

        await workflow2.save();
        
        let student1 = await User.register(new User({
            username: "106117007",
            name: "Adwaith D",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: false,
            pubKey: "0xE76759C0E555c724824E78bc4382cd6B116D7de0"
        }),"12345");

        let student2 = await User.register(new User({
            username: "102117058",
            name: "Subash Aravindan",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: false,
            pubKey: "insertpubhere"
        }),"12345");

        await student1.save();
        await student2.save();

        let request1 = new Request();
        request1.blockchainId= "bck1";
        request1.workflowId=workflow1;
        request1.approvers=[];
        request1.approvers.push({
            approverId: csehod,
            level: 0
        })
        request1.approvers.push({
            approverId: warden1,
            level: 1
        })
        request1.approvers.push({
            approverId: deanSW,
            level: 2
        })

        request1.approvedBy.push({
            approverId: csehod,
            level: 0
        });
        request1.level=1;
        request1.verificationKey="dfjdsfgdg";
        request1.ownerId= student1;
        request1.fields.push(...['Student Name', 'Fathers Name', '106117007', 'BTECH', 'CSE', '3', '6']);
        await request1.save();



        let request2 = new Request();
        request2.blockchainId= "bck2";
        request2.workflowId=workflow2;
        request2.approvers=[];
        request2.approvers.push({
            approverId: faDelta,
            level: 0
        })
        request2.approvers.push({
            approverId: deanSW,
            level: 1
        })
        request2.approvedBy=[]
        request2.level=0;
        request2.verificationKey="dfjdfsfssfgdg";
        request2.ownerId= student2;
        request2.fields.push(...["Student Name", "106117007", "3/02/2020", "6/02/2020", "Hackathon"]);
        await request2.save();



        res.json({sucess: true});


    }catch(err){
        console.log(err);
        res.json({sucess: false})
    }
}