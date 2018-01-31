'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Let done = this.async();

    this.log(
      yosay('Welcome to the fantastic ' + chalk.red('generator-gulp-i') + ' generator!')
    );

    // Const prompts = [{
    //   type: 'list',
    //   name: 'csspreproccess',
    //   message: 'Which css preprocessor you wish to use?',
    //   choices: [
    //       {
    //         name: 'Stylus',
    //         value: 'stylus'
    //       },
    //       {
    //         name: 'SCSS',
    //         value: 'scss'
    //       },
    //       {
    //         name: 'SASS',
    //         value: 'sass'
    //       },
    //       {
    //         name: 'LESS',
    //         value: 'less'
    //       }
    //   ],
    //   default: 0
    // }];
    //
    // return this.prompt(prompts).then(props => {
    //   // To access props later use this.props.someAnswer;
    //   this.cssprep = props.csspreproccess;
    //
    //   done();
    // });
  }

  writing() {
    mkdirp('app');
    mkdirp('app/styl');
    mkdirp('app/styl/import');
    mkdirp('app/js');
    mkdirp('app/img');
    mkdirp('app/fonts');
    mkdirp('app/html');
    mkdirp('app/html/template');
    mkdirp('build');

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json')
    );
    this.fs.copyTpl(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
  }

  install() {
    this.installDependencies({
      npm: true
    }).then(() => console.log('Everything is ready!'));
  }
};
