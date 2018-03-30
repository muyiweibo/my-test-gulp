var log = function (msg) {
    console.log('-------1616516');
    console.log(msg)
    console.log('-------wewe-wwww');
}
log({a:1})
log('gulp-book')

var testproto = function () {

}

var mytest = new testproto()
console.log(mytest.__proto__)
testproto.prototype = {
    say: function(){
        console.log("wwweeewe")
    }
}
//mytest.say()
var mytest2 = new testproto()
mytest2.say()