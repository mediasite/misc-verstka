var gulp = require('gulp');
require('gulp-watch');

var less = require('gulp-less');
var lessOptions = {
	strictImports: true,
	ieCompat: true,
	relativeUrls: false,
};

gulp.task('mainmenuupgrade', function() {
	return gulp.src('./main_menu_upgrade/css/*.less')
		.pipe(less(lessOptions))
		.pipe(gulp.dest('./main_menu_upgrade/css'));
});

gulp.task('atms', function() {
	return gulp.src('./atms/css/*.less')
		.pipe(less(lessOptions))
		.pipe(gulp.dest('./atms/css'));
});

gulp.task('mobile', function() {
	return gulp.src('./mobile/css/*.less')
		.pipe(less(lessOptions))
		.pipe(gulp.dest('./mobile/css'));
});

gulp.task('watch', function() {
	gulp.watch('./newMain/css/less/**/*.less', ['mainmenuupgrade', 'atms', 'mobile']);
	gulp.watch('./blocks/**/*.css', ['mobile']);
	gulp.watch('./mobile/css/*.less', ['mobile']);
});