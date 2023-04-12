const {src, dest, series, watch} = require('gulp')
const fileInclude = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const sass = require('sass')
const gulpSass = require('gulp-sass')
const mainSass = gulpSass(sass)
const cleanCSS = require('gulp-clean-css')
const webpackStream = require('webpack-stream')
const image = require('gulp-imagemin')
const webp = require('gulp-webp')
const avif = require('gulp-avif')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const browserSync = require('browser-sync').create()
const gulpif = require('gulp-if')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const typograf = require('gulp-typograf')

let isProd = false

const toProd = (done) => {
  isProd = true
  done()
}

const srcFolder = './src'
const buildFolder = './dist'

const paths = {
  srcPartialsFolder: `${srcFolder}/partials`,
  srcScss: `${srcFolder}/assets/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcImgFolder: `${srcFolder}/assets/img`,
  buildImgFolder: `${buildFolder}/img`,
  fontsFolder: `${srcFolder}/assets/fonts`
}

const htmlInclude = () => {
  return src([`${srcFolder}/*.html`])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src(`${buildFolder}/**/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(buildFolder))
}

const styles = () => {
  return src(paths.srcScss, {sourcemaps: !isProd})
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 2
    })))
    .pipe(dest(paths.buildCssFolder, {sourcemaps: '.'}))
    .pipe(browserSync.stream())
}

const scripts = () => {
  return src(paths.srcMainJs)
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err)
      this.emit('end')
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream())
}

const images = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`])
    .pipe(gulpif(isProd, image([
      image.mozjpeg({
        quality: 80,
        progressive: true
      }),
      image.optipng({
        optimizationLevel: 2
      }),
    ])))
    .pipe(dest(paths.buildImgFolder))
}

const webpImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder))
}

const avifImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(avif())
    .pipe(dest(paths.buildImgFolder))
}

const fonts = () => {
  return src(`${paths.fonts}/**`)
    .pipe(dest(buildFolder))
}

const clean = () => {
  return del([buildFolder])
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`
    }
  })

  watch(paths.srcScss, styles)
  watch(paths.srcFullJs, scripts)
  watch(`${paths.srcPartialsFolder}/**/**.html`, htmlInclude)
  watch(`${srcFolder}/*.html`, htmlInclude)
  watch(`${paths.fonts}/**`, fonts)
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images)
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages)
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, avifImages)
}

exports.default = series(clean, htmlInclude, scripts, styles, fonts, images, webpImages, avifImages, watchFiles);
exports.build = series(toProd, clean, htmlInclude, scripts, styles, fonts, images, webpImages, avifImages, htmlMinify);
