.pragma library
.import QtQuick.LocalStorage 2.0 as LS

function getDB() {
    return LS.LocalStorage.openDatabaseSync("PoetryDB", "1.0", "Poetry Database", 100000);
}

function init() {
    var db = getDB();
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS poems(title TEXT, body TEXT, author TEXT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS profile(name TEXT, bio TEXT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS friends(name TEXT, poems INTEGER)');
    });
}


function addPoem(title, body, author) {
    var db = getDB();
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO poems VALUES(?,?,?)', [title, body, author]);
    });
}

function getPoems(callback) {
    var db = getDB();
    db.transaction(function(tx) {
        var rs = tx.executeSql('SELECT * FROM poems');
        for (var i = 0; i < rs.rows.length; i++)
            callback(rs.rows.item(i));
    });
}


function saveProfile(name, bio) {
    var db = getDB();
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM profile');
        tx.executeSql('INSERT INTO profile VALUES(?,?)', [name, bio]);
    });
}

function getProfile(callback) {
    var db = getDB();
    db.transaction(function(tx) {
        var rs = tx.executeSql('SELECT * FROM profile');
        if (rs.rows.length > 0)
            callback(rs.rows.item(0));
    });
}


function addFriend(name, poems) {
    var db = getDB();
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO friends VALUES(?,?)', [name, poems]);
    });
}

function getFriends(callback) {
    var db = getDB();
    db.transaction(function(tx) {
        var rs = tx.executeSql('SELECT * FROM friends');
        for (var i = 0; i < rs.rows.length; i++)
            callback(rs.rows.item(i));
    });
}
