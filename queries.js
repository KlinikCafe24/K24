const axios = require('axios')
const crypto = require('crypto')

const { Pool } = require("pg")
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'directus_k24',
    password: 'root',
    port: 5433
});

// const getProduct = (request, response) => {
//     const responseReturn = new ResponseClass();
//     pool.query('SELECT * FROM Product', (error, results) => {
//         if (error) {
//             throw error
//         }
//         responseReturn.status = true;
//         responseReturn.code = 200;
//         responseReturn.message = "Success";
//         responseReturn.data = results.rows;
//         response.status(200).json(responseReturn);
//     })
// }

const query = `SELECT * FROM public.directus_users`;
const authLogin = (req, res) => {
    const username = req.body.username;
    const password = crypto.createHmac("sha256", req.body.password).digest("hex");
    if(username && password)
    {
        pool.connect((err) => {
            if(err) throw err;
            pool.query(query, (req, res) => {
                if(res)
                {
                    res.rows.forEach((element, req) => {
                        if (username === element.username && password === element.password) {
                            req.session.id = element.id;
                            req.session.username = element.username;
                        } 

                    });
                }
                else{
                    console.log("No Response Data not Found");
                }
            });
        })
    }
    else{
        return res
            .status(401)
            .send({message : "Username or Password Null"})
    }
}



const checkAuth = (req, res, next) =>  {
    if (!req.session.id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }
}



const config = { Authorization: "Bearer 6xi90t_us68NBlzdVRmjsWPaCqwCtBe1" }
const getUser = (req, res) => {
    axios.get('https://y1jeig5s.directus.app/items/user_data', { config }).then(function(response) {
            res.status(200).json({
                status: 1,
                data: response.data
            })
        })
        .catch(function(error) {
            res.status(404).json({
                message: error.message
            })
        })
};


const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    axios.get('https://y1jeig5s.directus.app/items/user_data', $id = { id }, { config }).then(function(response) {
            res.status(200).json({
                status: 1,
                data: response.data
            })
        })
        .catch(function(error) {
            res.status(404).json({
                message: error.message
            })
        })
}

const addUser = (req, res) => {
    const user = req.body
    axios.post('https://y1jeig5s.directus.app/items/user_data', {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password
        }, { config }).then(function(response) {
            res.status(200).json({
                status: 1,
                data: response.data
            })
            res.json(response.data)
        })
        .catch(function(error) {
            res.status(404).json({
                message: error.message
            })
            res.send(error)
        })
};




// const createProduct = (request, response) => {
//     const { firstname, lastname, origin } = request.body;
//     pool.query('INSERT INTO Product (firstname, lastname, origin) VALUES ($1, $2, $3)', [firstname, lastname, origin], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(201).send("Student added");
//     })
// }

// const updateProduct = (request, response) => {
//     const id = parseInt(request.params.id);
//     var responseReturn = new ResponseClass();
//     try {
//         const { firstname, lastname, origin } = request.body;
//         pool.query('UPDATE Product SET firstname = $1, lastname = $2, origin = $3 WHERE id = $4', [firstname, lastname, origin, id], (error, results) => {
//             if (error) {
//                 throw error
//             }

//             responseReturn.status = true;
//             responseReturn.code = 200;
//             responseReturn.message = "User modification successed";
//             responseReturn.data = null;
//             response.status(200).send(responseReturn);
//         })
//     } catch (error) {
//         responseReturn.status = false;
//         responseReturn.code = 500;
//         responseReturn.message = error.message;
//         responseReturn.data = null
//         response.status(500).json(responseReturn);
//     }
// }

// const deleteProduct = (request, response) => {
//     const id = parseInt(request.params.id)
//     pool.query('DELETE FROM Product WHERE id = $1', [id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(201).send("Student deleted");
//     })
// }


module.exports = {
    getUser,
    getUserById,
    addUser,
    authLogin,
    checkAuth
    // updateProduct,
    // deleteProduct
}