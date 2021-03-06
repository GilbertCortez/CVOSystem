
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
    db.query(`SELECT * FROM Organization`, (err, results, fields) => {
       db.query(`SELECT DISTINCT int_OrganizationId FROM batchofanimalturnover`,(err,usedOrganization)=>{ 
            res.render('CVO-M-Organization/views/view.ejs', {organizations:results,usedOrganization:usedOrganization});
        });
    });
});

router.post('/add', (req,res)=>{

    var org_name = req.sanitize(req.body.orgname.trim());
    var org_email = req.sanitize(req.body.orgemail.trim());
    var org_telnum = req.sanitize(req.body.orgtelnum.trim());
    var org_cellnum = req.sanitize(req.body.orgcellnum.trim());

    db.query(`INSERT INTO organization (str_OrganizationName,str_Email,str_TelephoneNumber,str_CellphoneNumber) 
    VALUES ("${org_name}","${org_email}","${org_telnum}","${org_cellnum}")`,(err, results, fields)=>{
        if (err){
            console.log(err)
            res.redirect("/CVO_Organization");
        }
        else {
            res.redirect("/CVO_Organization");
        }
    })
});

router.post('/delete', (req, res)=>{
    console.log(req.body.id)
    db.query(`DELETE FROM organization WHERE int_OrganizationId = ${req.body.id}`,(err)=>{
        console.log(err)
    })
});

router.post('/update',(req, res) =>{
    var update_id = req.body.modal_orgid;
    var update_orgname = req.body.modal_orgname.trim();
    var update_orgemail = req.body.modal_orgemail.trim();
    var update_orgtelnum = req.body.modal_orgtelnum.trim();
    var update_orgcellnum = req.body.modal_orgcellnum.trim();

    db.query(`UPDATE organization SET str_OrganizationName = "${update_orgname}",
    str_Email = "${update_orgemail}", str_TelephoneNumber = "${update_orgtelnum}",
    str_CellphoneNumber = "${update_orgcellnum}" WHERE int_OrganizationId = ${update_id}`, (err,results)=>{
        if(err){
            console.log(err)
            res.redirect("/CVO_Organization")
        }
        else {
            res.redirect("/CVO_Organization")
        }
    })
});

router.post('/updateStatus', (req, res)=>{
    db.query('UPDATE organization SET int_Status='+req.body.status+' WHERE int_OrganizationId='+req.body.id,(err)=>{
        if(err){
            res.send("ERROR")
        }
        else{
            res.send("SUCCESS")
        }
    })
});
exports.CVO_Organization= router;
