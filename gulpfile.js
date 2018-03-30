var gulp = require("gulp");
var uglify = require("gulp-uglify")
var watchPath = require("gulp-watch-path")
var combiner = require("stream-combiner2")
var sourcemaps = require("gulp-sourcemaps")
var minifycss = require("gulp-minify-css")
var autoprefixer = require("gulp-autoprefixer")
var less = require("gulp-less")
var sass = require("gulp-sass")//require("gulp-ruby-sass"),这个需要ruby环境才有效
var imagemin = require("gulp-imagemin")
var clean = require("gulp-clean")
//var connect = require("gulp-connect")
var browsersync = require("browser-sync").create()

var errorHandler = function () {
    console.log('has error')
}

gulp.task("watchjs",function () {
    gulp.watch("src/js/**/*.js",function(event){
        var paths = watchPath(event, "src/", "dist/")
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write("./"),
            gulp.dest(paths.distDir)//,
            //browsersync.reload({stream: true})//js变化后热更新页面
        ])
        combined.on("error",errorHandler)
    })
})
gulp.task("uglifyjs",function () {
    gulp.src("src/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
})

gulp.task("watchcss",function () {
    gulp.watch("src/**/*.css",function (event) {
        var paths = watchPath(event,"src/","dist/");
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
                browsers: 'last 2 versions'
            }),
            minifycss(),
            sourcemaps.write("./"),
            gulp.dest(paths.distDir)
        ])
    })
})
gulp.task("minifycss",function () {
    gulp.src("src/css/**/*.css")
    .pipe(sourcemaps.init())
    .pipe(minifycss())
    .pipe(autoprefixer({
        browsers: 'last 2 versions'
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/css"))
})

gulp.task("watchless",function(){
    gulp.watch("src/less/**/*.less",function (event) {
        var paths = watchPath(event,"src/less","dist/css")
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
                browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write("./"),
            gulp.dest(paths.distDir)
        ])
    })
})
gulp.task("less",function () {
    var combined = combiner.obj([
        gulp.src("src/less/**/*.less"),
        sourcemaps.init(),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        less(),
        minifycss(),
        sourcemaps.write("./"),
        gulp.dest("dist/css")
    ])
    combined.on("error",errorHandler)
})

gulp.task("watchsass",function () {
    gulp.watch("src/sass/**/*.scss",function (event) {
        var paths = watchPath(event,"src/sass","dist/css");
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            sass().on("error",sass.logError),
            autoprefixer({
                browsers: 'last 2 versions'
            }),
            minifycss(),
            sourcemaps.write(),
            gulp.dest(paths.distDir)
        ])
        combined.on("error",errorHandler);
    })
})
gulp.task("sasscss",function () {//需要return
    return gulp.src("src/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error",sass.logError))
    .pipe(autoprefixer({
        browsers: 'last 2 versions'
    }))
    .pipe(minifycss())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/css"))
})

gulp.task("imagemin",() => {
    gulp.src("src/images/**/*")
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest("dist/images"))
})

gulp.task("clean", () => {//需要return
    return gulp.src("./dist")
    .pipe(clean())
})

gulp.task("copy",function () {//复制直接是输入再输出到其他页面
    gulp.src("src/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"))
})

gulp.task("browser",function () {
    browsersync.init({
        port: 8888,
        server: {
            baseDir: ['./']
        }
    })
})

gulp.task("watch-dist-change",function () {
    gulp.watch("src/**/*",function(event){
        gulp.src("src/**/*")
        .pipe(browsersync.reload({stream: true}))
    })
})

gulp.task("watchhtml",function(){
    gulp.watch("*.html",function(event){
        gulp.src("*.html")
        .pipe(browsersync.reload({stream: true}))
    })
})
gulp.task("default",["clean"],function () {//这种为回调方式，是先删除完成再编译
    gulp.start("uglifyjs","minifycss","less","sasscss","imagemin","copy","browser","watchjs","watchcss","watchless","watchsass","watchhtml","watch-dist-change");
})
//gulp.task("default",["uglifyjs","minifycss","less","sasscss","imagemin","copy","connect","watchjs","watchcss","watchless","watchsass"])
//gulp.task("default",["clean","uglifyjs","minifycss","less","sasscss","imagemin","watchjs","watchcss","watchless","watchsass"])//下面这种为异步，可能一边编译一边删除