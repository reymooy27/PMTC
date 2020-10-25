const Joi = require("@hapi/joi");

//registration validation

const registerValidation = (data) => {
  const schema = Joi.object({
    teamName: Joi.string().required(),
    singkatanTeam: Joi.string().max(5).required(),
    logo: Joi.optional(),
    idPlayer: Joi.number().integer().required(),
    idPlayer2: Joi.number().integer().required(),
    idPlayer3: Joi.number().integer().required(),
    idPlayer4: Joi.number().integer().required(),
    idPlayer5: Joi.number().integer().optional().allow(''),
    playerName: Joi.string().max(15).required(),
    playerName2: Joi.string().max(15).required(),
    playerName3: Joi.string().max(15).required(),
    playerName4: Joi.string().max(15).required(),
    playerName5: Joi.string().max(15).optional().allow(''),
    handphoneNumber: Joi.number().integer().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"],
        },
      })
      .required(),
  });

  return schema.validate(data);
};

const signupValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"],
        },
      })
      .required(),
    password: Joi.string().max(10).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().max(10).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;
