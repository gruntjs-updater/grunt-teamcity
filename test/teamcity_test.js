/* global events, jshint node:true  */
'use strict';

var grunt = require('grunt');
var exec = require('child_process').exec;


// polyfill for Harmony String.contains
if(!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
  };
}


exports.teamcity = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(2);
    exec('grunt teamcity:default_options isolated_test --no-color', function(err, stdout){
      var rawMsgCount = 0;
      var tcMsgCount = 0;
      stdout.split('\n').forEach(function(line){
        if (line.contains("##teamcity[message text='foo-bar-uniqe-string' errorDetails='' status='ERROR'")) {
          tcMsgCount++;
        }
        else if (line.contains("foo-bar-uniqe-string")) {
          rawMsgCount++;
        }
      });

      test.equal(rawMsgCount, 1, 'Message is output');
      test.equal(tcMsgCount, 1, 'Message is output in Teamcity format');
      test.done();
    });
  },
  suppress_gruntlog_options: function(test) {
    test.expect(2);
    exec('grunt teamcity:suppress_gruntlog_options isolated_test --no-color', function(err, stdout){
      var rawMsgCount = 0;
      var tcMsgCount = 0;
      stdout.split('\n').forEach(function(line){
        if (line.contains("##teamcity[message text='foo-bar-uniqe-string' errorDetails='' status='ERROR'")) {
          tcMsgCount++;
        }
        else if (line.contains("foo-bar-uniqe-string")) {
          rawMsgCount++;
        }
      });

      test.equal(rawMsgCount, 0, 'Message is output');
      test.equal(tcMsgCount, 1, 'Message is output in Teamcity format');
      test.done();
    });
  },
  custom_status_mapping: function(test) {
    test.expect(1);
    exec('grunt teamcity:custom_status_mapping isolated_test --no-color', function(err, stdout){
      var tcMsgCount = 0;
      stdout.split('\n').forEach(function(line){
        if (line.contains("##teamcity[message text='foo-bar-uniqe-string' errorDetails='' status='CUSTOM'")) {
          tcMsgCount++;
        }
      });

      test.equal(tcMsgCount, 1, 'Message is output in Teamcity format with custom status');
      test.done();
    });
  }
};
