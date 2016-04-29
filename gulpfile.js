"use strict";

var gulp = require("gulp");
var dest = require("gulp-dest");
var ts = require("gulp-typescript");
var plumber = require("gulp-plumber");

function compileAll(){
    compileTypescript();
}

gulp.task("default", compileAll);

/**************************** Compilers ************************************/
function compileTypescript() {
    let tsProject = ts.createProject("tsconfig.json");
    return tsProject.src().pipe(plumber({
        errorHandler: (err) => { throw err; }
    })).pipe(ts(tsProject)).pipe(gulp.dest("."));
}
