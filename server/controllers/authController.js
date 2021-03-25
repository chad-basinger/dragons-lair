const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db');
        const {username, password, isAdmin} = req.body;

        try {
            const result = await db.get_user([username])
            const existingUser = result[0];

            if (existingUser) {
                return res.status(409).send('Username taken')
            }
            //hash and salt the password
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

    
            //add the user to the db and get back their id
            const registeredUser = await db.register_user([isAdmin, username, hash])
            //create a session for the user using the db response
            const user = registeredUser[0];
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            }

            //send a response that includes the user session info
            res.status(201).send(req.session.user)

        } catch(err){
            console.log(err)
            return res.sendStatus(500)
        }

    }
}