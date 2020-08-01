const User = require("../models/user");
const Group = require("../models/group");
const Workflow = require("../models/workflow");

exports.seedDB = async (req,res) => {
    try{
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
        hodGrp.members.push(csehod);
        hodGrp.members.push(csehod);
        hodGrp.members.push(eeehod);
        hodGrp.members.push(ecehod);

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
        deanGrp.members.push(deanFW);
        deanGrp.members.push(deanSW);
        deanGrp.members.push(deanPD);

        await deanGrp.save();


        // Faculty advisor

        let faDelta = await User.register(new User({
            username: "fadelta",
            name: "FA Delta",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: true,
            pubKey: "insertpubhere"
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
        faGrp.members.push(faDelta);
        faGrp.members.push(faRMI);
        faGrp.members.push(faSpider);

        await faGrp.save();


        // Workflows

        let workflow1 = new Workflow();
        workflow1.name="Workflow 1";
        workflow1.fields.push({
            desc: "a",
            htmlId: "field_a"
        })
        workflow1.fields.push({
            desc: "b",
            htmlId: "field_b"
        })
        workflow1.approvers.push({
                grp: faGrp,
                level: 0
        })
        workflow1.approvers.push({
            grp: hodGrp,
            level: 1
        });

        await workflow1.save();

        let workflow2 = new Workflow();
        workflow2.name="Workflow 2";
        workflow2.fields.push({
            desc: "2a",
            htmlId: "field_2a"
        })
        workflow2.fields.push({
            desc: "2b",
            htmlId: "field_2b"
        })
        workflow2.approvers.push({
                grp: hodGrp,
                level: 0
        })
        workflow2.approvers.push({
            grp: deanGrp,
            level: 1
        });

        await workflow2.save();
        
        let student1 = await User.register(new User({
            username: "student1",
            name: "Student 1",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: false,
            pubKey: "insertpubhere"
        }),"12345");

        let student2 = await User.register(new User({
            username: "student2",
            name: "Student 2",
            email: "abc@abc.com",
            mobile: "999999999",
            isAdmin: false,
            pubKey: "insertpubhere"
        }),"12345");

        await student1.save();
        await student2.save();
        res.json({sucess: true});


    }catch(err){
        console.log(err);
        res.json({sucess: false})
    }
}