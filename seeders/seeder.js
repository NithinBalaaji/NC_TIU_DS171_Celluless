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
            email: "102117058@nitt.edu",
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
            email: "102117058@nitt.edu",
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
            username: "faculty_advisor_1",
            name: "Faculty Advisor 1",
            email: "p.subasharavindan15@gmail.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "0xd6f26DAB93B724EbD822277B07b80F5576685c95",
        }),"12345");

        let faSpider = await User.register(new User({
            username: "faculty_advisor_2",
            name: "Faculty Advisor 2",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
        }),"12345");

        let faRMI = await User.register(new User({
            username: "faculty_advisor_3",
            name: "Faculty Advisor 3",
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
        workflow1.fields.push(...["Date", "Name", "Letter number", "Letter date", "Specialisation", "Department", "Joining date"]);
        workflow1.approvers.push({
            grp: wardenGrp,
            level: 0
        });
        workflow1.approvers.push({
            grp: deanGrp,
            level: 1
        });
        workflow1.approvers.push({
            grp: faGrp,
            level: 2
        });
        workflow1.approvers.push({
                grp: hodGrp,
                level: 3
        });
        workflow1.templatePath = "default.jpg";
        workflow1.generatedPath = "default.jpg";

        await workflow1.save();

        let workflow2 = new Workflow();
        workflow2.name="OD";
        workflow2.fields.push(...["Date", "Name", "Letter number", "Letter date", "Specialisation", "Department", "Joining date"]);
        workflow2.approvers.push({
                grp: faGrp._id,
                level: 0
        })
        workflow2.approvers.push({
            grp: deanGrp._id,
            level: 1
        });
        workflow2.templatePath = "default.jpg";
        workflow2.generatedPath = "default.jpg";

        await workflow2.save();
        
        let student1 = await User.register(new User({
            username: "adwaith",
            name: "Adwaith D",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: false,
            pubKey: "0xE76759C0E555c724824E78bc4382cd6B116D7de0"
        }),"12345");

        let student2 = await User.register(new User({
            username: "subash",
            name: "Subash Aravindan",
            email: "p.subasharavindan@gmail.com",
            mobile: "999999999",
            isAdmin: false,
            pubKey: "insertpubhere"
        }),"12345");

        let student3 = await User.register(new User({
            username: "108117021",
            name: "Bharath Kumar R",
            email: "bharathkumarravichandran@gmail.com",
            mobile: "7708845078",
            isAdmin: false,
            pubKey: "insertpubhere"
        }),"12345");

        await student1.save();
        await student2.save();
        await student3.save();

        let request1 = new Request();
        request1.blockchainId= "bck1";
        request1.workflowId=workflow1;
        request1.approvers=[];
        request1.approvers.push({
            approverId: warden1,
            level: 0
        })
        request1.approvers.push({
            approverId: deanSW,
            level: 1
        })
        request1.approvers.push({
            approverId: faDelta,
            level: 2
        })
        request1.approvers.push({
            approverId: csehod,
            level: 3
        })

        request1.approvedBy.push({
            approverId: warden1,
            level: 0
        });
        request1.approvedBy.push({
            approverId: deanFW,
            level: 1
        });
        request1.level=2;
        request1.verificationKey="dfjdsfgdg";
        request1.ownerId= student2;
        request1.fields.push(...['Subash', 'Parivallal', '102117058', 'BTECH', 'Chemical', '3', '6']);
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


        request2 = new Request();
        request2.blockchainId= "bck3";
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