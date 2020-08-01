const projectRouter = require('express').Router();
var Project = require('../models/project');
var User = require('../models/user');
var mongoose = require('mongoose');
const { isLoggedIn } = require('../middlewares/auth');

projectRouter.post('/create', isLoggedIn, function (req, res) {
    if (
        !req.body.isPublic ||
        !req.body.desc ||
        !req.body.name
    ) {
        console.log("Request parameters at project/create not sufficient");
        res.json({ success: false });
    }
    else {
        var project = new Project();
        project.isPublic = (req.body.isPublic == "true");
        project.owner = req.user._id;
        project.desc = req.body.desc;
        project.name = req.body.name;
        project.thread = [];
        if (req.body.tags) {
            project.tags = req.body.tags;
        }

        project.fundRecv = 0;
        project.members.push(req.user._id);
        project.save(function (err, newProject) {
            res.redirect('/projects');
        })

    }

})

projectRouter.get('/new', async (req, res) => {
    res.render('projects/new-project');
})


projectRouter.get('/', function (req, res) {
    Project.find({}).populate('owner').exec(function (err, projects) {
        if (err) {
            console.log("TCL: err", err)
            res.json({ success: false });
        }
        else {
            res.render('projects/list-projects', { projects });
        }
    })
})

projectRouter.get('/:id', function (req, res) {
    Project.findById(req.params.id)
        .populate('members')
        .populate('funders')
        .populate('owner')
        .populate('thread.owner')
        .exec(function (err, project) {
            if (err || !project) {
                console.log("Error or Project with the given id does not exists.");
                res.json({ success: false });
            }
            else {
                let flag=!req.user.isStudent;
                if(req.user._id.toString()==project.owner._id.toString()) flag=false;

                project.fundProp.forEach(funder => {
                    if(funder.owner._id.toString()==req.user._id.toString()){
                        flag=false;
                    }
                });
                res.render('projects/show-project', { project: project, showFund: flag});
            }
        })
})

projectRouter.post('/:id/request', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err || !project) {
            console.log("Error or Project with the given id does not exists.");
            res.json({ success: false });
        }
        else {
            project.requests.push(req.user);
            project.save(function (err) {
                if (err) {
                    console.log("Error in saving project");
                    res.json({ success: false });
                }
                else {
                    res.redirect(`/projects/${req.params.id}`);
                }
            })
        }
    })
})

projectRouter.post("/:id/accept/:userid", function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err || !project) {
            console.log("Error or Project with the given id does not exists.");
            res.json({ success: false });
        }
        else if (req.user._id.toString() != project.owner.toString()) {
            console.log("Request not made by owner of the project.");
            res.json({ success: false });
        }
        else {
            User.findById(req.params.userid, function (err, user) {
                if (err || !user) {
                    console.log("Error or User with the given id does not exist.");
                    res.json({ success: false });
                }
                else {
                    let flag = false;
                    project.requests = project.requests.filter(preq => {
                        flag = (flag || (preq.toString() == req.params.userid));
                        return preq.toString() != req.params.userid;
                    })
                    if (!flag) {
                        console.log("No request by passed userid");
                        res.json({ success: false });
                    }
                    else {
                        project.members.push(user._id);
                        project.save(function (err) {
                            if (err) {
                                console.log("Error in saving updated project");
                                res.json({ success: false });
                            }
                            else {
                                res.redirect(`/projects/${req.params.id}/manage`);
                            }
                        })
                    }
                }
            })
        }
    })
})


projectRouter.post("/:id/reject/:userid", function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err || !project) {
            console.log("Error or Project with the given id does not exists.");
            res.json({ success: false });
        }
        else if (req.user._id.toString() != project.owner.toString()) {
            console.log("Request not made by owner of the project.");
            res.json({ success: false });
        }
        else {
            User.findById(req.params.userid, function (err, user) {
                if (err || !user) {
                    console.log("Error or User with the given id does not exist.");
                    res.json({ success: false });
                }
                else {
                    let flag = false;
                    project.requests = project.requests.filter(preq => {
                        flag = (flag || (preq.toString() == req.params.userid));
                        return preq.toString() != req.params.userid;
                    })
                    if (!flag) {
                        console.log("No request by passed userid");
                        res.json({ success: false });
                    }
                    else {
                        project.save(function (err) {
                            if (err) {
                                console.log("Error in saving updated project");
                                res.json({ success: false });
                            }
                            else {
                                res.redirect(`/projects/${req.params.id}/manage`);
                            }
                        })
                    }
                }
            })
        }
    })
})


projectRouter.post('/:id/fund', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err || !project) {
            console.log("Error or Project with the given id does not exists.");
            res.json({ success: false });
        }
        else {
            var fundObj = new Object();
            fundObj.owner = req.user;
            fundObj.amount = req.body.amount;
            fundObj.desc = req.body.desc;
            project.fundProp.push(fundObj);

            project.save(function (err) {
                if (err) {
                    console.log("Error in saving project");
                    res.json({ success: false });
                }
                else {
                    res.redirect('/projects/'+req.params.id);
                }
            })
        }
    })
})

projectRouter.post("/:id/acceptProp/:userid", function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err || !project) {
            console.log("Error or Project with the given id does not exists.");
            res.json({ success: false });
        }
        else if (req.user._id.toString() != project.owner.toString()) {
            console.log("Request not made by owner of the project.");
            res.json({ success: false });
        }
        else {
                User.findById(req.params.userid, function (err, user) {
                    if (err || !user) {
                        console.log("Error or User with the given id does not exist.");
                        res.json({ success: false });
                    }
                    else {
                        let flag = false, flag2=true;
                    let amt = 0;
                    project.fundProp = project.fundProp.filter(freq => {
                        if (freq.owner.toString() == req.params.userid) {
                            flag = true;
                            amt = freq.amount;
                        }
                        return freq.owner.toString() != req.params.userid;
                    })
                    project.funders.forEach(funder=>{
                        if(funder.toString()==req.params.userid){
                            flag2=false;
                        }
                    })
                    if (!flag) {
                        res.json({ success: false });
                    }
                    else {
                        if(flag2){
                            project.funders.push(user._id);
                        }
                        project.fundRecv += amt;
                        project.save(function (err) {
                            if (err) {
                                console.log("Error in saving updated project");
                                res.json({ success: false });
                            }
                            else {
                                res.redirect(`/projects/${req.params.id}/manage`);
                            }
                        })
                    }
                }
                
            })
        }
    })
})

projectRouter.post('/:id/comment', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err || !project) {
            console.log("Error or Project not found");
            res.json({ success: false });
        }
        else {
            let msg = new Object();
            msg.owner = req.user;
            msg.message = req.body.message;
            project.thread.push(msg);
            project.save(function (err) {
                if (err) {
                    console.log("Error in saving project");
                    res.json({ success: false });
                }
                else {
                    res.redirect(`/projects/${req.params.id}`);
                }
            })
        }
    })
})

projectRouter.get('/:id/manage', async (req, res) => {
    try {
        let project = await Project.findById(req.params.id)
            .populate('requests')
            .populate('members')
            .populate('fundProp.owner')
            .exec();
        res.render('projects/manage-project', { project });
    } catch (error) {
        res.json({error});
    }
})

module.exports = projectRouter;
