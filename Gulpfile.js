let gulp = require('gulp');
let sass = require('gulp-sass');

gulp.task('sass', ()=> {
    gulp.src('sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/'));    
})

gulp.task('default', () => {
    gulp.watch('sass/*.scss', ['sass']);
});