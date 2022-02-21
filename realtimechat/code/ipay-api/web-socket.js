var mysql = require('mysql');
var config = require('./config.js');

var ipay = mysql.createPool({
    connectionLimit: 100,
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db,
    debug: false
});

function socketFunction(io) {
    // // Define/initialize our global vars
    var notes = []
    var isInitNotes = false
    var socketCount = 0
    var ids = []
    io.sockets.on('connection', function (socket) {
        // Socket has connected, increase socket count
        socketCount++
        // Let all sockets know how many are connected
        io.sockets.emit('users connected', socketCount)
        console.log('users connected', socketCount)
        //chatRoomId.push('id')



        socket.on('disconnect', function () {
            // Decrease the socket count on a disconnect, emit
            socketCount--
            io.sockets.emit('users connected', socketCount)

        })

        socket.on('new note', function (data) {
            // New note added, push to all sockets and insert into db
            notes.push(data)
            io.sockets.emit('new note', data)
            // Use node's db injection format to filter incoming data
            //db.query('INSERT INTO notes (note) VALUES (?)', data.note)
        })


        socket.on('newnotes', function (data) {
            // chatRoomId.push(data)
            io.sockets.emit('chatid', note)
            console.log('chatid', data);

        })
        // socket.on('chat fromtoid', function (data) {
        //     console.log('chat fromtoid', data);
        // })

        // socket.on('chat toid', function (data) {
        //     console.log('chat toid', data);
        // })

        var GetChatRoom = function (chat_fromid, chat_toid) {
            return new Promise((resolve, reject) => {

                var chatFT = chat_fromid + '-' + chat_toid;
                var chatTF = chat_toid + '-' + chat_fromid;

                ipay.getConnection(function (err, connection) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        //we need to check the first or second combination using single mysql query
                        connection.query("SELECT * FROM `chat_rooms` WHERE `cr_users` = ? OR `cr_users` = ?", [chatFT, chatTF], function (err, rows, result) {
                            console.log(rows, err);
                            console.log(rows.length);
                            //console.log('uid', rows.insertId);
                            if (!rows.length) {
                                connection.query("INSERT INTO `chat_rooms` (`cr_users`) VALUES ('" + chatFT + "') ", function (err, rows, res) {
                                    connection.release();
                                    if (!err) {
                                        var obj = {
                                            cr_id: rows.insertId,
                                            cr_users: chatFT
                                        };
                                        resolve(obj);
                                    } else {
                                        reject(err);
                                    }
                                });
                            } else {
                                console.log(rows);
                                var obj = {
                                    cr_id: rows[0].cr_id,
                                    cr_users: rows[0].cr_users
                                };
                                resolve(obj);
                            }

                        })
                    }

                });
            });
        }

        socket.on('GetChatRoom', function (result) {
            //console.log('GetChatRoom ',result);
            GetChatRoom(result.from_id, result.to_id).then((res) => {
                // send the chat room data back to the client
                io.emit('ChatRoom', res);
            }, (err) => {

            });
        });

        socket.on('chat fromtoid', function (result) {
            console.log('result', result);

            crusers(result, function (res) {
                if (res) {
                    console.log('res', res);
                    // var cr_id =ids.push(res);
                    //console.log('cr_id',cr_id);
                    var chatids = result.chat_fromid + '-' + result.chat_toid;
                    var chattoids = result.chat_toid + '-' + result.chat_fromid;

                    console.log('chatids', chatids, chattoids);
                    // io.sockets.emit('chat fromtoid', cr_id);

                } else {
                    io.emit('error');
                }
            });
        });


        var crusers = function (chatids, callback) {
            console.log('cti', chatids);
            var chatFT = chatids.chat_fromid + '-' + chatids.chat_toid;
            var chatTF = chatids.chat_toid + '-' + chatids.chat_fromid;
            // var fid = chatids.chat_fromid;
            // console.log('fid',fid);
            console.log('chatids', chatFT);
            ipay.getConnection(function (err, connection) {
                if (err) {
                    callback(false);
                    return;
                }
                //we need to check the first or second combination using single mysql query
                connection.query("SELECT cr_users FROM `chat_rooms` WHERE `cr_users` = ? OR `cr_users` = ?", [chatFT, chatTF], function (err, rows, result) {
                    console.log(rows, err);
                    console.log(rows.length);
                    //console.log('uid', rows.insertId);
                    if (!rows.length) {
                        connection.query("INSERT INTO `chat_rooms` (`cr_users`) VALUES ('" + chatFT + "') ", function (err, rows, res) {
                            //console.log('cr_id',rows.insertId);
                            connection.release();


                            if (!err) {
                                // var uid = rows.insertId;
                                // console.log('uid', uid);
                                // return res.json({ status: true, uid: uid });
                                callback({ status: true });
                            }
                        });
                    }


                    else {
                        callback({ status: "already existed" });
                    }

                })


                connection.on('error', function (err) {
                    callback(false);
                    return;
                });

                // connection.query("INSERT INTO `chats` (`from_id`) VALUES ('" + fid + "') ", function (err, rows, res) {
                //     console.log(err,rows,res);
                // })
            });

        }


        //////chats table////////////////////////////////////////////////////

        socket.on('send', function (data) {
            console.log('chat fromid', data);
            insert_chat(data, function (res) {
                if (res) {
                    console.log(res);
                    var statusid = data.chat_fromid;
                    var usermsg = data.newmsg;
                    io.sockets.emit('chat fromid', statusid, usermsg);
                    // var socketId = data.chat_toid;
                    // console.log('socketId',socketId);
                    // io.to(socketId).emit("chat fromid", data);
                    // io.on("connection", (socket) => {
                    //     console.log('socket',socket)
                    //     socket.join("some room");
                    //     socket.to("some room").emit("some event");
                    // });
                    // io.to("some room").emit("some event");
                } else {
                    io.emit('error');
                }
            });
        })

        var insert_chat = function (data, callback) {
            console.log('status_167', data);

            // io.on("connection", (socket) => {
            //     socket.on("private message", (anotherSocketId, msg) => {
            //       socket.to(anotherSocketId).emit("private message", socket.id, msg);
            //     });
            //   });

            ipay.getConnection(function (err, connection, rows) {
                if (err) {
                    callback(false);
                    return;
                }


                connection.query("INSERT INTO `chats` (`from_id`,`cr_id`,`msg`) VALUES (?,?,?)",[data.from_id, data.cr_id, data.msg], function (err, rows) {
                    console.log('err', err);
                    console.log('row', rows)
                    connection.release();

                    if (!err) {
                        callback(true);
                    }
                });



                connection.on('error', function (err) {
                    callback(false);
                    return;
                });


            });

        }



        // Check to see if initial query/notes are set

        socket.on('get notes', function (data) {
            console.log(data);
            api.query('SELECT * FROM api_table')
                .on('result', function (data) {
                    // Push results onto the notes array

                    notes.push(data)
                    console.log(data);
                })
                .on('end', function () {
                    //Only emit notes after query has been completed
                    io.sockets.emit('initial notes', notes)
                })
        })

        if (!isInitNotes) {
            // Initial app start, run db query


            isInitNotes = true
        }
        else {
            //Initial notes already exist, send out
            //socket.emit('initial notes', notes)
        }


        socket.on('status added', function (status) {
            add_status(status, function (res) {
                if (res) {
                    console.log(res);
                    io.emit('refresh feed', status);

                } else {
                    io.emit('error');
                }
            });
        });

        var add_status = function (status, callback) {
            api.getConnection(function (err, connection) {
                if (err) {
                    callback(false);
                    return;
                }
                connection.query("INSERT INTO `api_table` (`s_text`) VALUES ('" + status + "')", function (err, rows) {
                    connection.release();
                    if (!err) {
                        callback(true);
                    }
                });

                connection.on('error', function (err) {
                    callback(false);
                    return;
                });


            });

        }


        // io.on("connection", (socket) => {
        //     // notify existing users
        //     socket.broadcast.emit("user connected", {
        //         userID: socket.id,
        //         username: socket.username,
        //     });
        // });
        // io.on('connection', function (socket) {
        //     socket.on('join', function (data) {    
        //      socket.join(data.email);
        //    });
        //  });
        //  io.to('user@example.com').emit('message', {msg: 'hello world.'});
    })
}









module.exports = socketFunction;
