import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';

const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  service: "gmail",
  auth: {
    user: "hadjer.messaoudene18@gmail.com",
    pass: "nijt exbg pmuz fmkv",
  },
});

export const sendVerificationEmail = (to: string, verificationLink: string) => {
  const mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene19@gmail.com>',
    to,
    subject: 'Email Verification',
    html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = (to: string, resetPasswordLink: string) => {
  const mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene19@gmail.com>',
    to,
    subject: 'Reset Password',
    html: `Click the following link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendNewDemandeEmail = (to: string, nom: string, prenom: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Nouvelle demande reçue sur la plateforme TalentoLink',
    template: 'newDemandeEmail',
    context: {
      title: 'Nouvelle Demande de service',
      nom,
      prenom
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeAnnuleeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande annulée',
    template: 'demandeAnnuleEmail',
    context: {
      title: 'Demande de service Annulée',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeModifieeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande modifiée',
    template: 'demandeModifieEmail',
    context: {
      title: 'Demande de service Modifiée',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeEnvoyeeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande envoyée avec succès',
    template: 'demandeEnvoyeeEmail',
    context: {
      title: 'Demande de Service Envoyée avec succès',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeTraiteeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande en cours de traitement',
    template: 'demandeTraiteeEmail',
    context: {
      title: 'Demande de Service En Cours de Traitement',
      nom,
      prenom,
      titre,
    }
  
  };
  
  return transporter.sendMail(mailOptions);
};

export const sendDemandeAccepteeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande Acceptée',
    template: 'demandeAccepteeEmail',
    context: {
      title: 'Demande de Service Acceptée',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeRefuseeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande de Service Refusée',
    template: 'demandeRefuseeEmail',
    context: {
      title: 'Demande de Service Refusée',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeConfirmeeEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande de Service Confirmée',
    template: 'demandeConfirmeeEmail',
    context: {
      title: 'Demande de Service Confirmée',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

export const sendDemandeConfirmeeOffreurEmail = (to: string, nom: string, prenom: string, titre: string) => {

  const handlebarOptions: any = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./src/utils/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/emailTemplates'),
    extName: ".handlebars",
  };
  transporter.use('compile', hbs(handlebarOptions));

  
  var mailOptions = {
    from: '"TalentoLink" <hadjer.messaoudene18@gmail.com>',
    to,
    subject: 'Demande de Service Confirmée',
    template: 'demandeConfirmeeOffreurEmail',
    context: {
      title: 'Demande de Service Confirmée',
      nom,
      prenom,
      titre,
    }
  
  };

  return transporter.sendMail(mailOptions);
};

