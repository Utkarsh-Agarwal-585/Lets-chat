var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', function (req, res) {
  var input = req.body;
  // console.log(input);
  // res.json(input);
  //input.session_tocken = ''; 
  req.getConnection(function (error, conn) {
    if (conn) {
      // if(err){
      //   var sql='SELECT fb_uid FROM users WHERE fb_uid=input.uid';
      //   conn.query(sql,function(err,result){
      //     this.err.code;
      //   })
      // }

      conn.query(
        'INSERT INTO `users` (fb_uid,first_name,last_name,email,contact_no) VALUES (?,?,?,?,?)',
        [input.uid, input.fname, input.lname, input.email, input.contactno],

        function (err, rows, 
          
          ) {
          if (err) {
            //console.log(err);
            if (err.code && err.code == 'ER_DUP_ENTRY') { // email id exist
              return res.json({ status: false, message: 'This user is already exist' });
            } else {
              console.log(err);
              return res.json({ status: 'error' });
            }
          } else {
            console.log("========================signup========================");
            console.log(rows);
            var uid = rows.insertId;

            return res.json({ status: true, uid: uid });
          }
        },
      );


    }
    else {
      console.log(error);
      return res
        .status(401)
        .json({ status: false, message: 'unable to connect' });
    }
  });



});

router.get('/list', function (req, res, next) {

  req.getConnection(function (error, conn) {
    if (conn) {
      // res.json({
      //   data: [
      //     {
      //       quote: 'There are only two kinds of languages: the ones people complain about and the ones nobody uses.',
      //       author: 'Bjarne Stroustrup'
      //     }
      //   ],
      //   meta: {
      //     page: 1
      //   }
      // });

      conn.query('SELECT `uid`,`fb_uid`,CONCAT(`first_name`," ",`last_name`) AS `fullname` FROM `users`;', function (err, rows, fields) {
        if (rows) {
          console.log(rows);
          return res.json({ status: true, data: rows });
          // var first_name = rows.fname;
          // console.log(first_name);
        }
      },
      );

    }
  });
});


//  socket.on("send_message", function (data) {
//             // send event to receiver
//             var socketId = users[data.id];
//             console.log(socketId)
         
//             io.to(socketId).emit("new_message", data.id);
         
//             // save in database
//             ipay.query("INSERT INTO chat_rooms (sender, receiver, message) VALUES ('" + data.sender + "', '" + data.receiver + "', '" + data.message + "')", function (error, result) {
//                 //
//             });
//         });


module.exports = router;

