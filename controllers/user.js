const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signup = (req, res, next) => {
  //Utilisation de bcrypt pour hacher le mot de passe
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
        // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      })
       // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
   // Recherche de l'utilisateur dans la base de données par email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Paire login/mot de passe incorrecte' })
      }
     // Comparaison du mot de passe fourni avec le mot de passe haché en base
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: 'Paire login/mot de passe incorrecte' })
          }
          res.status(200).json({
            userId: user._id,
            // Clé secrète pour signer le token (à remplacer par une variable d'environnement en production)
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
              expiresIn: '24h',
            }),
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}
