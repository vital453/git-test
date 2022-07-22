//team work patner push test1
var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
const multer = require('multer');
const path = require('path');


var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
const multer = require('multer');
const path = require('path');
var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
const multer = require('multer');
const path = require('path');
var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})


app.use(cors());
app.use(bodyparser.json());


app.listen('3004',()=>{
    console.log('server is running....');
})

// http://localhost:3004/api

// mysql database connection 
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'benixags_shop',
})

// check db connection 
db.connect((err)=>{
    if(err) throw err;
    else
    {
        console.log('database connected ....');
    }
});



app.get('/', (req, res) => {
    res.json({'message':'OKAY'});
     console.log('server is running....');
});

//Liste categories

app.get('/affichecategory', (req, res) => {
    db.query("SELECT * FROM category", (err, result) => {
        {/* -la bibliothèque axios permet d'envoyer les requêtes de recherche sql dans la base de données grâce aux fonctions post get put  */ }
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})


//récupération d'une category
app.post('/recupcat', (req, res) => {
    const id = req.body.id
    db.query("SELECT * FROM category  WHERE id =?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})

app.get('/supprpan', (req, res) => {
    

    db.query("DELETE FROM panier where 1=1 ", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})

app.delete('/deletepan/:ide', (req, res) => {
    const id = req.params.ide
    db.query("DELETE FROM panier WHERE product_id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
})


app.put('/majpan', (req, res) => {
    const product_quantity = req.body.product_quantity;
    const product_id = req.body.product_id;
    const total_price = (req.body.price*req.body.product_quantity);
    db.query('UPDATE panier SET product_quantity = ?, total_price= ? WHERE product_id = ? ', [product_quantity, total_price ,product_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})








//afficher le panier
app.get('/affichepanier', (req, res) => {
    db.query("SELECT * FROM panier", (err, result) => {
        {/* -la bibliothèque axios permet d'envoyer les requêtes de recherche sql dans la base de données grâce aux fonctions post get put  */ }
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})




//ajouter au panier

app.post('/ajoutpanier', (req, res) => {
    {/* -Pour l'exécution des requêtes on a besoin d'initialiser une connexion à la bd et qui contiendra les identifiants de connexions   */ }
    const product_id = req.body.product_id;
    const unite_price = req.body.unite_price;
    const product_quantity = req.body.product_quantity;
    const total_price = req.body.total_price;
    const product_name = req.body.product_name;
    const stock = req.body.stock;
    
    db.query('INSERT INTO panier (product_id, product_name, unite_price, product_quantity, total_price,stock) VALUES (?,?,?,?,?,?)'
        , [product_id, product_name, unite_price, product_quantity, total_price, stock ],
        (err, result) => {
            if (err) {
                console.log(err);
            } else { 
                res.send("suc");
            }
        });
})

// créer une commande
app.post('/ajoutcommande', (req, res) => { 
    const totalquant = req.body.totalquant;
    const totalprix = req.body.totalprix;
    const invoice = req.body.invoice;
    db.query('INSERT INTO command_validation (invoice, total_quantity, total_price) VALUES (?,?,?)'
        , [invoice, totalquant, totalprix],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("suc");
            }
        });
})





// créer liste commande
app.post('/ajoutcomList', (req, res) => {
    let numfin=0;
    let newnum=0;
    const panier = req.body.panier; 
    let id= 0;
    let taillecom = [];
    const tail = req.body.tail; 
    const whatsapp = req.body.whatsapp; 
    
    db.query("SELECT * FROM command_validation", (err, result)=>{
        if(err){
            console.log(err);
        }else {
            if(result){
                db.query("SELECT MAX(id) AS TOTA FROM command_validation", (err, result) =>{
                    if(err){
                        console.log(err);
                    }else{
                        id= result[0].TOTA;
                        db.query("SELECT * FROM command_validation WHERE id = ?",id,
                        (err, result) =>{
                                if(err){
                                    console.log(err);
                                }else {
                                    numfin = parseInt(result[0].invoice.slice(5));
                                    newnum = numfin + 1;
                                    invoice = `FAB00${newnum}`;  
                                      for (var i = 0; i < tail; i++) {
                                            db.query('INSERT INTO commands (product_quantity, total_price , unite_price , product_name,product_id, invoice, whatsapp) VALUES (?,?,?,?,?,?,?)',
                                            [panier[i].product_quantity, panier[i].total_price, panier[i].unite_price , panier[i].product_name,panier[i].product_id, invoice, whatsapp],(err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    res.send(invoice);
                                                }
                                            })
                                        }   
                                }
                        })
                    }
                })
            } 
        }
    })
})



app.post('/reclusia', (req, res) => {
    const pan = req.body.panier;
    
    db.query("SELECT * FROM products  WHERE id =?", panier[0].product_id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})








//récupération d'un article
app.post('/recupart', (req, res) => {
    const id = req.body.id

    db.query("SELECT * FROM products  WHERE id =?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})
//test
app.post('/test1', (req, res) => {
    const id = req.body.id

    res.send(id+"")
})




//liste des articles
app.get('/afficheart', (req, res)=>{
    db.query('SELECT * FROM products', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});
//liste des articles par ordre croissant
app.get('/afficheartcroiss', (req, res)=>{
    db.query('SELECT * FROM products ORDER BY name ASC', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});

//`SELECT * FROM todotbl ORDER BY id DESC LIMIT 10`

app.get('/arrivage', (req, res)=>{
    db.query(`SELECT * FROM products ORDER BY id DESC LIMIT 10`, (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});

app.get('/populaire', (req, res)=>{
    db.query(`SELECT * FROM products ORDER BY id ASC LIMIT 10`, (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});



//liste des articles par categorie
app.post('/articlecateg', (req, res) => {
    const idcat = req.body.idcat

    db.query("SELECT * FROM products  WHERE category_id =?", idcat, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})

//liste des commandes
app.get('/affichecommande', (req, res)=>{
    db.query('SELECT * FROM command_validation', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});

//liste des commandes validées
app.get('/affichecomv', (req, res)=>{
    
    db.query('SELECT * FROM command_validation WHERE statut =1 ', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});



//liste articles par commande
app.post('/afficheartcom', (req, res)=>{
    const invoice = req.body.invoice
    db.query('SELECT * FROM commands WHERE invoice =? ', invoice,  (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});
//mise à jour satut
app.post('/majstatut', (req, res) => {
    const invoice = req.body.invoice;
    db.query('UPDATE command_validation SET statut = 1 WHERE invoice =? ', invoice, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }
    })
});



app.put('/imga/:id/:stat', async (req, res) => {	
    const id = req.params.id ; 
    const stat=  req.params.stat ; 
		 // 'avatar' is the name of our file input field in the HTML form
		let upload = multer({ storage: storage}).single('avatar');
		
		upload(req, res, function(err) {
			// req.file contains information of uploaded file
			// req.body contains information of text fields

			if (!req.file) {
				return res.send('Please select an image to upload');
			}
			else if (err instanceof multer.MulterError) {
				return res.send(err);
			}
			else if (err) {
				return res.send(err); 
			}
			 let classifiedsadd = {picture2: req.file.filename};
		    if(stat==1){
			    classifiedsadd = {
				picture1: "uploads/"+req.file.filename};
			}
			if(stat==2){
			    classifiedsadd = {
				picture2: "uploads/"+req.file.filename};
			}
			if(stat==3){
			    classifiedsadd = {
				picture3: "uploads/"+req.file.filename};
			}
			if(stat==4){
			    classifiedsadd = {
				picture4: "uploads/"+req.file.filename};
			}
			if(stat==5){
			    classifiedsadd = {
				video: "uploads/"+req.file.filename};
			}
			
			
		//	const sql = "UPDATE products SET picture2 = ? WHERE id = 47";
		    const sql = "UPDATE products SET ? WHERE id = ?";
			db.query(sql, [classifiedsadd, id],  (err, results) => { 
			    if (err){res.send(err) }
			    else{
			        res.json({ success: 1 });
			    }
			//	res.json({ success: 1 }) ;     
             //   res.send(id+"");
			});  
		});  
    
  //res.send(id+"");
});


app.post('/newart', async (req, res) => {
    
    const nom = req.body.nom;
    const prix = req.body.prix;
    const reduc = req.body.reduc;
    const description = req.body.descript; 
    const stock = req.body.stock; 
    const seller_id= req.body.seller_id;
    const category= req.body.category;
    const like= req.body.like;
    const prixachat= req.body.prixachat;
    db.query('INSERT INTO products (name,price,description,discount,seller_id,stock, category_id, like_number, cost) VALUES (?,?,?,?,?,?,?,?,?)'
        , [nom,prix,description,reduc,seller_id,stock, category, like, prixachat],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //res.send("suc");
                db.query('SELECT  MAX(id) AS tota FROM products ', (err, result) =>{
                      if(err){
                          console.log(err);
                      }else {
                          res.send(result);
                      }
                });
            }
        });
})

app.post('/rej',  (req, res)=>{
  //  const id = req.body.id;
    res.send(2);
    
});



//*************************************************      nelson     **********************************************************************

/* obtenir la liste des produits */
app.get('/productslist', (req, res)=>{
    
    db.query('SELECT * FROM products', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});
/* detail d'un produit*/
app.post('/detailProduct', (req, res)=>{
    const productId = req.body.productId;

    db.query("SELECT * FROM products WHERE id = ?", [productId],
    (err, result) =>{
            if(err){
                console.log(err);
            }else {
                // console.log(result);
                res.send(result);
            }
        }
    )    
});
/* obtenir l'invoice*/
app.get('/getInvoice', (req, res)=>{
    let invoice = "";
    let nbrligne = 0;
    let numfacend = 0;
    let newfacend = 0;
    db.query("SELECT * FROM commands", (err, result)=>{
        if(err){
            console.log(err);
        }else {
            nbrligne = result.length;
            if(nbrligne > 0){

                db.query("SELECT MAX(id) AS TOTA FROM commands", (err, result) =>{
                    if(err){
                        console.log(err);
                    }else {
                        db.query("SELECT * FROM commands WHERE id = ?", [result[0].TOTA],
                        (err, result) =>{
                                if(err){
                                    console.log(err);
                                }else {
                                    numfacend = parseInt(result[0].invoice.slice(5));
                                    // numfacend = parseInt(result[0].invoice.split('0')[2]);
                                    newfacend = numfacend + 1;
                                    invoice = `FAB00${newfacend}`;
                                    res.send(invoice);
                                        
                                }
                            }
                        );  
                    }
                })
            }else{
                invoice = "FAB001";
                res.send(invoice);
            }
        }
    })
});
/* ajouter au panier */
app.post('/addcart', (req, res)=>{
    const product_id = req.body.product_id;
    const product_quantity = req.body.product_quantity;
    const product_name = req.body.product_name;
    const unite_price = req.body.unite_price;
    const total_price = req.body.total_price;
    const picture = req.body.picture;
    const invoice = req.body.invoice;

    db.query('INSERT INTO commands (product_id, product_quantity, product_name, unite_price, total_price, picture, invoice) VALUES (?,?,?,?,?,?,?)',
        [product_id, product_quantity, product_name, unite_price, total_price, picture, invoice], (err, result) =>{
            if(err){
                console.log(err); 
            }else {
                res.send("Values Inserted");
            }
        }
    );
});
/* obtenir la liste des commandes validées par l'utilisateur */
app.post('/historique', (req, res) =>{
    const invoice = req.body.invoice;
    db.query('SELECT * FROM commands WHERE invoice = ?', [invoice], (err, result) =>{
        if(err){
            console.log(err);
        }else {
            res.send(result);
        }
    }
  );
});
/* obtenir la liste des commandes */
app.post('/getcommands', (req, res) =>{
    const statut = 0;
    db.query('SELECT * FROM commands WHERE statut = ?', [statut], (err, result) =>{
        if(err){
            console.log(err);
        }else {
            res.send(result);
        }
    }
  );
});
/*suppression d'un éléments du panier */
app.delete('/supprimerduPanier/:id', (req, res)=>{
    const id= req.params.id ;
    db.query('DELETE FROM commands WHERE id = ?',
       id, (err, result) =>{
        if(err){
            console.log(err);
        } else{ console.log('succes');
         res.send(result);
        }
    }
   );

});
/*validation de la commande */
app.post('/updatecart', (req, res)=>{
    const invoice = req.body.invoice;
    const total_price = req.body.total_price;
    const total_quantity = req.body.total_quantity;
    const num = req.body.num;
    
    
    db.query('INSERT INTO command_validation (total_quantity, total_price, invoice, whatsapp) VALUES (?,?,?,?)',
        [total_quantity, total_price, invoice, num], (err, result) =>{
            if(err){
                console.log(err); 
            }else {
                // res.send("Values Inserted");
                db.query("SELECT date FROM command_validation WHERE invoice = ?", [invoice],
                (err, result) => {
                    if(err){
                        console.log(err);
                    }else {
                        res.send(result);
                    }
                });
            }
        }
    );
});
/* rechercher une commande */
app.post('/recherchcommand', (req, res) =>{
    const product_id = req.body.product_id;
    const statut = 0;
    db.query('SELECT * FROM commands WHERE product_id = ? AND statut = ?', [product_id, statut], (err, result) =>{
        if(err){
            console.log(err);
        }else {
            res.send(result);
        }
    }
  );
});
/*mise à jour de la quantité de produit commander */
app.put('/updatecommand', (req, res)=>{
    const id = req.body.id;
    const product_quantity = req.body.product_quantity;
    const total_price = req.body.total_price;
    
    
    db.query('UPDATE commands SET product_quantity = ?, total_price = ? WHERE id = ?',
    [product_quantity, total_price, id], (err, result) =>{
        if(err){
            console.log(err);  
        }else {
            // console.log('succes');
            res.send("Values Inserted");
        }
    }
    );
    
    
});

//******************************************************     vital     *****************************************************************


// REST API CURD

app.get('/api',(req,res)=>{
    res.send('Api working');
});


// Create data 

app.post('/api/create/:nom/:prenom',(req,res)=>{

    console.log(req.body);
    console.log(req.params.nom);
    console.log(req.params.prenom);
    // const nom = req.body.nom
    // const prenom = req.body.prenom
    const nom = req.params.nom
    const prenom = req.params.prenom

    // sql query 

    let sql = ` INSERT INTO todotbl(nom, prenom)
                VALUES('${nom}', '${prenom}')
               `;
    // run query 
    db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send('data inserted');
    });        


});




// Read data 
app.get('/api/read',(req,res)=>{
    // sql query 
     let val=50;
    let sql = `SELECT * FROM products where like_number > ?`;
    // run query 
    db.query(`SELECT * FROM products where like_number > ? `,val, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/api/reader',(req,res)=>{
    // sql query 
     let val=50;
    let sql = `SELECT * FROM products where like_number > ?`;
    // run query 
    db.query(`SELECT * FROM products where like_number < ? `,val, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

// Read single data 
app.get('/api/reading',(req,res)=>{
    console.log(req.body.id);
    const id = req.body.id
    // sql query 
    let sql = `SELECT * FROM todotbl`;
    // run query 
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });          


});

// update single data 

app.put('/api/update/:id/:nom/:prenom',(req,res)=>{
        console.log(req.params);
        const id = req.params.id
        const nom = req.params.nom
        const prenom = req.params.prenom
        // sql query 

        db.query('UPDATE todotbl SET nom = ?, prenom = ? WHERE id = ? ',
             [nom, prenom, id]
                , (err, result) => {
                    if (err) {
                        console.log(err);
                      //  throw err;
                    } else {
                        res.send("data updated")
                    }
                })
                 
})


// delete single data 

app.delete('/api/delete/:id',(req,res)=>{
const id = req.params.id
    // sql query 

    db.query("DELETE FROM todotbl WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("data deleted")
           // res.send(result);
        }
    });
        
});


app.get('/invoice',(req,res)=>{
// sql query 
let idmax;
let lastinvoice;
//let sql = `SELECT * FROM todotbl`;    
// run query 
db.query("SELECT MAX(id) AS TOTA FROM command_validation",(err,result)=>{
    if(err) throw err;
    idmax=result[0].TOTA
    // db.query("SELECT invoice FROM command_validation WHERE id = ?",idmax,(err,result)=>{
    //     if(err) throw err;
    //     console.log(result[0].invoice);
    // });
  
    res.send(`${idmax}`);
});
});


app.get('/invoicee',(req,res)=>{
// sql query 
let idmax;
let  status=1;
//let sql = `SELECT * FROM todotbl`;
// run query 
db.query("SELECT MAX(id) AS TOTA FROM commands",(err,result)=>{
    if(err) throw err;
    idmax=result[0].TOTA
    db.query("SELECT statut FROM commands WHERE id = ?",idmax,(err,result)=>{
        if(err) throw err;
        status=result[0].statut;
        if(status==0){
            let hac=0;
        console.log('pas nouvelle facture');
        res.send(`${hac}`)
        }else{
            let hac=1;
            console.log('nouvelle facture');
            res.send(`${hac}`)
        }
       //console.log(result[0].statut);
        
    });
   // res.send(`${idmax}`);
});
});

app.get('/cherchernumfaclast',(req,res)=>{
    // sql query 
    let idmax;

    db.query("SELECT MAX(id) AS TOTA FROM commands",(err,result)=>{
        if(err) throw err;
        idmax=result[0].TOTA
        db.query("SELECT invoice FROM commands WHERE id = ?",idmax,(err,result)=>{
            if(err) throw err;
            invoicer=result[0].invoice;
            res.send(`${invoicer}`);
        });
       // res.send(`${idmax}`);
    });
    });

app.get('/exitcont',(req,res)=>{
db.query("SELECT * FROM commands",(err,result)=>{
    if(err) throw err;
    numRows = result.length;
    console.log(numRows);
    res.send(`${numRows}`);
});
});

app.get('/nombrartpan',(req,res)=>{
let idmax; 
db.query("SELECT MAX(id) AS TOTA FROM commands ",(err,result)=>{
    if(err) throw err;
    idmax=result[0].TOTA
    db.query("SELECT invoice,statut FROM commands WHERE id = ?",idmax,(err,result)=>{
        if(err) throw err;
        console.log(result[0].invoice);
        console.log(result[0].statut);
        let stat=result[0].statut
        let inv=result[0].invoice
        if(stat==0){
            db.query("SELECT invoice FROM commands where invoice=?",inv,(err,result)=>{
                if(err) throw err;
                numRows = result.length;
                console.log(numRows);
                res.send(`${numRows}`);
            });
        }else{
            res.send("");
        }  
    });
});
});

app.post('/exitart',(req,res)=>{
    const nfac = req.body.nfac
    const product_name = req.body.product_name
db.query("SELECT product_name FROM commands where invoice=? and product_name=?",[nfac,product_name],(err,result)=>{
    if(err) throw err;
    numRows = result.length;
    console.log(numRows);
    res.send(`${numRows}`);
});
});
app.post('/createcommand/:statut/:product_id/:product_name/:unite_price/:product_quantity/:total_price/:invoice/:picture',(req,res)=>{

    const statut = req.params.statut
    const product_id = req.params.product_id
    const product_name = req.params.product_name
    const unite_price = req.params.unite_price
    const product_quantity = req.params.product_quantity
    const total_price = req.params.total_price
    const invoice = req.params.invoice
    const picture = req.params.picture

    let sql = ` INSERT INTO commands(statut, product_id, product_name, unite_price, product_quantity, total_price, invoice, picture)
                VALUES('${statut}', '${product_id}', '${product_name}', '${unite_price}', '${product_quantity}', '${total_price}', '${invoice}', '${picture}')
               `;
    // run query 
    db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send('produit ajouter au panier');
    });        


});


app.post('/api/createe',(req,res)=>{

    const statut = req.body.statut
    const product_id = req.body.product_id
    const product_name = req.body.product_name
    const unite_price = req.body.unite_price
    const product_quantity = req.body.product_quantity
    const total_price = req.body.total_price
    const invoice = req.body.invoice
    const picture = req.body.picture

    let sql = ` INSERT INTO commands(statut, product_id, product_name, unite_price, product_quantity, total_price, invoice, picture)
                VALUES('${statut}', '${product_id}', '${product_name}', '${unite_price}', '${product_quantity}', '${total_price}', '${invoice}', '${picture}')
               `;
    // run query 
    db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send('produit ajouter au panier');
    });        


});

app.get('/recuppan',(req,res)=>{
let idmax; 
db.query("SELECT MAX(id) AS TOTA FROM commands ",(err,result)=>{
    if(err) throw err;
    idmax=result[0].TOTA
    db.query("SELECT invoice,statut FROM commands WHERE id = ?",idmax,(err,result)=>{
        if(err) throw err;
        console.log(result[0].invoice);
        console.log(result[0].statut);
        let stat=result[0].statut
        let inv=result[0].invoice
        if(stat==0){
            db.query("SELECT * FROM commands where invoice=?",inv,(err,result)=>{
                if(err) throw err;
                numRows = result.length;
                console.log(result);
                res.send(result);
            });
        }else{
            res.send("");
        }  
    });
});
});

app.post('/nectar', (req, res) => {
    const id = req.body.id
    db.query("SELECT unite_price FROM commands WHERE id = ?", id, (err, result) => {
        if (err) throw err;
        console.log(result[0].unite_price);
        res.send(result[0].unite_price + "")
    });
});


app.get('/totalprice', (req, res) => {
    let idmax;
    let total_price;
    db.query("SELECT MAX(id) AS TOTA FROM commands ", (err, result) => {
        if (err) throw err;
        idmax = result[0].TOTA
        db.query("SELECT invoice,statut FROM commands WHERE id = ?", idmax, (err, result) => {
            if (err) throw err;
            console.log(result[0].invoice);
            console.log(result[0].statut);
            let stat = result[0].statut
            let inv = result[0].invoice
            if (stat == 0) {
                db.query("SELECT SUM(total_price) AS prix_total FROM commands where invoice=?", inv, (err, result) => {
                    if (err) throw err;
                    numRows = result.length;
                    console.log(result[0].prix_total);
                    total_price=result[0].prix_total;
                    console.log(total_price);
                    res.send(total_price+'');
                });
            } else {
                res.send("");
            }
        });
    });
});

app.get('/api/readingsim1',(req,res)=>{
    console.log(req.body.id);
    const id = req.body.id
    // sql query 
    let sql = `SELECT * FROM todotbl WHERE simchoice = ?`;
    // run query 
    db.query(sql,0,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });          
});
app.get('/api/readingsim2',(req,res)=>{
    console.log(req.body.id);
    const id = req.body.id
    // sql query 
    let sql = `SELECT * FROM todotbl WHERE simchoice = ?`;
    // run query 
    db.query(sql,1,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });          
});

app.get('/api/readinglast',(req,res)=>{
    console.log(req.body.id);
    const id = req.body.id
    // sql query 
    let sql = `SELECT * FROM todotbl ORDER BY id DESC LIMIT 10`;
    // run query 
    db.query(sql,0,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });          
});

app.get('/api/readingmarch',(req,res)=>{
    console.log(req.body.id);
    const id = req.body.id
    // sql query 
    let sql = `SELECT * FROM marchand`;
    // run query 
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });          
});

app.post('/addussd', (req, res) => {
    const libeler = req.body.libeler;
    const codeussd = req.body.codeussd;
    const simchoice = req.body.simchoice;
    db.query('INSERT INTO todotbl (libeler, codeussd, simchoice) VALUES (?,?,?)'
        , [libeler, codeussd, simchoice],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("code ussd ajouter avec  succes");
            }
        });
});

app.post('/addmarchand', (req, res) => {
    const nommarchand = req.body.nommarchand;
    const idmarchand = req.body.idmarchand;
    const simchoice = req.body.simchoice;
    db.query('INSERT INTO marchand (nom_marchand, id_marchand, simchoice) VALUES (?,?,?)'
        , [nommarchand, idmarchand, simchoice],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Marchand crée avec  succes");
            }
        });
});

app.delete('/delussd', (req, res)=>{
    const id= req.body.id ;
    db.query('DELETE FROM todotbl WHERE id = ?',
       id, (err, result) =>{
        if(err){
            console.log(err);
        } else{ console.log('succes');
         res.send("code ussd supprimer avec  succes");
        }
    }
   );

});


/************************************************************************************vital shop back ***********************************************************************/

app.delete('/delarticle', (req, res)=>{
    const id= req.body.id ;
    db.query('DELETE FROM products WHERE id = ?',
       id, (err, result) =>{
        if(err){
            console.log(err);
        } else{ console.log('succes');
         res.send("succes");
        }
    }
   );

});

// commande en cours 

app.get('/commandecours', (req, res) => {
    const statut = 0;
    db.query('SELECT invoice,whatsapp,command_date,livraison_date,customer_id, SUM(total_price) AS TOTALPRICE , SUM(product_quantity) AS TOTALQUANTITE FROM commands WHERE statut = ?  GROUP BY invoice LIMIT 5',statut,(err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});

//récupération d'un article
app.post('/recupart', (req, res) => {
    const id = req.body.id

    db.query("SELECT * FROM products  WHERE id =?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})
//liste des articles
app.get('/affichearticles', (req, res)=>{
    db.query('SELECT * FROM products', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});
//liste des articles par ordre croissant
app.get('/afficheartcroiss', (req, res)=>{
    db.query('SELECT * FROM products ORDER BY name ASC', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});


//liste des articles par categorie
app.post('/articlecateg', (req, res) => {
    const idcat = req.body.idcat

    db.query("SELECT * FROM products  WHERE category_id =?", idcat, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);

        }
    })
})

//liste des commandes
app.get('/affichecommande', (req, res)=>{
    db.query('SELECT * FROM command_validation', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});

//liste des commandes validées
app.get('/affichecomv', (req, res)=>{
    
    db.query('SELECT * FROM command_validation WHERE statut =1 ', (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});



//liste articles par commande
app.post('/afficheartcom', (req, res)=>{
    const invoice = req.body.invoice
    db.query('SELECT * FROM commands WHERE invoice =? ', invoice,  (err, result) =>{
          if(err){
              console.log(err);
          }else {
              res.send(result);
          }
      }
    );
});
//mise à jour satut
app.post('/majstatut', (req, res) => {
    const invoice = req.body.invoice;
    db.query('UPDATE command_validation SET statut = 1 WHERE invoice =? ', invoice, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }
    })
});


// {/* -Fichier server qui se charge de gérer l'envoi des requêtes de recherche depuis le programme à la base de donnée créée
// */}
// const express = require('express');
// const app = express();
// const mysql = require('mysql');
// const cors = require('cors');

// require("dotenv").config(); 

// app.use(cors()); {/* -La mise en place de son environnement nécessite l'installation de certains packets  */ }
// app.use(express.json());

// const db = mysql.createConnection({
//     user: 'root',
//     host: 'localhost',
//     password: '',
//     database: 'company',
// })
// db.connect(function (error) {
//     if(error){
//         console.log(error);
//         return;
//     } else {
//         console.log('Database is connected');
//     }
// });

// app.get('/', (req, res) => {
//             res.json({'message':'OK'});
// });
// app.get('/users', (req, res) => {
//     db.query('select * from user', (error, rows, fields) => {
//         if(!error) {
//             res.json(rows);
//         } else {
//             console.log(error);
//         }
//     });
// });

// //This function allows us concatenate 'id' to url => localhost:4000/id
// app.get('/users/:id', (req, res) => {
//     const { id } = req.params;
//     db.query('select * from user where id = ?', [id], (error, rows, fields) => {
//         if(!error) {
//             res.json(rows);
//         } else {
//             console.log(error);
//         }
//     })
// });

// app.post('/createusers', (req, res) => {
//     //const { id,  } = req.body;
//     const username = req.params.username
//     const name = req.params.name
//     const lastname = req.params.lastname
//     const mail = req.params.mail
//     const randomstr = req.params.randomstr
//     const hash = req.params.hash

//     console.log(username, name, lastname, mail, randomstr, hash);
//     db.query('insert into user(username, name, lastname, mail, randomstr, hash) values (?, ?, ?, ?, ?, ?)', [ username, name, lastname, mail, randomstr, hash], (error, rows, fields) => {
//         if(!error) {
//             res.json({Status : "User saved"})
//         } else {
//             console.log(error);
//         }
//     });
// })

// app.put('/updateusers/:id', (req, res) => {
//     const { id, username, name, lastname, mail, randomstr, hash } = req.body;
//     console.log(req.body);
//     db.query('update user set username = ?, name = ?, lastname = ?, mail = ?, randomstr = ?, hash = ? where id = ?;', 
//     [username, name, lastname, mail, randomstr, hash, id], (error, rows, fields) => {
//         if(!error){
//             res.json({
//                 Status: 'User updated'
//             });
//         } else {
//             console.log(error);
//         }
//     });
// });

// app.delete('/deleteusers/:id', (req,res) => {
//     const { id } = req.params;
//     db.query('delete from user where id = ?', [id], (error, rows, fields) => {
//         if(!error){
//             res.json({
//                 Status: "User deleted"
//             });
//         } else {
//             res.json({
//                 Status: error
//             });
//         }
//     })
// });
// app.listen(8001, () => {
//     console.log('server lancé')
// }) 
// // app.listen(process.env.PORT || 3001, () => {
// //     console.log('server lancé')
// // }) 