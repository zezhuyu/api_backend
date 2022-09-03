import express from "express";
import hash from 'object-hash';
import nodemailer from "nodemailer";
import i18n from 'i18n';
import config from "../config.json" assert {type: "json"};
import cn from '../language/zh-cn.json' assert {type: "json"};
import en from '../language/en.json' assert {type: "json"};

const router = express.Router();

const mailNotification = {
    from :{
        name: 'Sam Web Notification',
        address: config.email.email
    },
    to:{
        name: config.email.notifyname,
        address: config.email.notifyemail
    },
    subject: "",
    text: ""
};

const mailComfirmation = {
    from: {
        name: '',
        address: config.email.email
    },
    to: {
        name: '',
        address: ''
    },
    subject: "",
    text: ""
}

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.email.user, // generated ethereal user
        pass: config.email.password, // generated ethereal password
    },
});

router.route("/client/auth/sendemail").post(async(req, res) => {
    
    if(req.headers['token'] == null || req.headers['token'] !== config.email.token){
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    const lang = req.body.language ==='zh-CN'?cn:en;
    
    mailNotification.subject = req.body.subject;
    mailNotification.text = (" Name: " + req.body.name + "\nEmail: " + req.body.email + "\nMessage: " + req.body.message + "\nLang: " + req.body.language);
    
    mailComfirmation.from.name = lang.email.rsender;
    mailComfirmation.to.name = req.body.name;
    mailComfirmation.to.address = req.body.email;
    mailComfirmation.subject = lang.email.rsubject;
    mailComfirmation.text = lang.email.rgreeting + req.body.name + ",\n\n " + lang.email.rmessage + "\n\n" + lang.email.rfooter;
    


    var saved = false;
    var notifyError = "";
    await transporter.sendMail(mailComfirmation, function(error, info){
        if (error) {
            console.log(error);
            notifyError = error;
        } else {
            saved = true;
        }
    });
    
    await transporter.sendMail(mailNotification, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).send({ message: error, sent: false });
        } else {
            res.status(200).send({ message: info.response, sent: true });
        }

    });
});

router.route("/").get((req, res) => {
    Posts.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json("Error: " + err));

});

export default router;