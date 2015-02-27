'use strict';

var App = (function() {
  var $filesDiv;
  var init = function() {
    $filesDiv = $('#fileBrowser');
    loadFiles();
  };

  var loadFiles = function() {
    $.ajax({
      url: 'http://localhost:3000/fs_items',
      type: 'GET',
      dataType: 'json'
    })
    .done(function(files) {
      renderFiles(files.fs_items);
    })
    .fail(function(err) {
      console.log('error' + err);
    });
  };

  var renderFiles = function(files) {
    for(var i = 0; i < files.length; i++) {
      renderFile(files[i]);
    }
  };

  var renderFile = function(file) {
    var $fileDiv = $('<div>');
    // var $fileLink = $('<a>');
    $fileDiv.text(file.name);
    $filesDiv.append($fileDiv);
  };

  return {init: init};
})();

$(document).ready(function() {
  App.init();
});
