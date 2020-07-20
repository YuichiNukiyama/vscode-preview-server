const gulp = require("gulp");
const path = require("path");

const ts = require("gulp-typescript");
const typescript = require("typescript");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const es = require("event-stream");
const vsce = require("vsce");
const nls = require("vscode-nls-dev");

const tsProject = ts.createProject("./tsconfig.json", { typescript });

const inlineMap = true;
const inlineSource = false;
const outDest = "out";

// If all VS Code langaues are support you can use nls.coreLanguages
const languages = ["jpn"];

// ---- internal

function compile(buildNls) {
    var r = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
        .pipe(buildNls ? nls.createAdditionalLanguageFiles(languages, "i18n", "out") : es.through());

    if (inlineMap && inlineSource) {
        r = r.pipe(sourcemaps.write());
    } else {
        r = r.pipe(sourcemaps.write("../out", {
            // no inlined source
            includeContent: inlineSource,
            // Return relative source map root directories per file.
            sourceRoot: "../src"
        }));
    }

    return r.pipe(gulp.dest(outDest));
}

gulp.task("internal-compile", function() {
    return compile(false);
});

gulp.task("internal-nls-compile", function() {
    return compile(true);
});

gulp.task("add-i18n", function() {
    return gulp.src(["package.nls.json"])
        .pipe(nls.createAdditionalLanguageFiles(languages, "i18n"))
        .pipe(gulp.dest("."));
});

gulp.task("vsce:publish", function() {
    return vsce.publish();
});

// ---- external

gulp.task("clean", function() {
    return del(["out/**", "package.nls.*.json"]);
});

gulp.task("build", gulp.series("clean", "internal-nls-compile", "add-i18n"));

gulp.task("compile", gulp.series("clean", "internal-compile"));

gulp.task("publish", gulp.series("build", "vsce:publish"));

gulp.task("default", gulp.series('build'));