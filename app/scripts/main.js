'use strict';

var App = (function() {
  var $filesDiv, fileRootID, $detailsBar, $moveFile, $copyFile, $whereSelect, rootURL;

  var init = function() {
    rootURL = 'https://enigmatic-mesa-2291.herokuapp.com/';
    $whereSelect = $('#whereSelect');
    $detailsBar = $('#fileInfo');
    $moveFile = $('#moveFile');
    $copyFile = $('#copyFile');
    $filesDiv = $('#fileBrowser');
    fileRootID = queryString();
    requestFiles();
  };

  var queryString = function() {
    // This function isn't my code, but is here for getting the query string parameter
    // I'm 100% certain I could write it, but was pushing a little for time.
    var vars = [], hash;
    var q = document.URL.split('?')[1];
    if(q !== undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }
    }
    return vars.fs_item;
  };

  var requestFiles = function() {
    $.ajax({
      url: rootURL + '/fs_items',
      type: 'GET',
      dataType: 'json',
      data: { fs_item: fileRootID }
    })
    .done(function(files) {
      renderFiles(files.fs_items);
    });
  };

  var renderFiles = function(files) {
    for(var i = 0; i < files.length; i++) {
      renderFile(files[i]);
    }
  };

  var renderFile = function(file) {
    var $fileDiv = $('<div>');
    var $fileLink = $('<a>');

    $fileLink.text(file.name);

    // This isn't the smoothest ever
    if (file.kind === 'directory') {
      $fileLink.prop('href', '/?fs_item=' + file.id );
      var icon = '<span class=\'glyphicon glyphicon-folder-close\'>';
      $fileLink.prepend(icon);
    } else {
      $fileLink.on('click', file, showDetails);
    }
    $fileDiv.append($fileLink);
    $filesDiv.append($fileDiv);
  };

  var showDetails = function(event) {
    $detailsBar.removeClass('hidden');
    $detailsBar.find('#fileName').text(event.data.name);
    $moveFile.on('click', {action: moveFile, file: event.data}, toWhere);
    $copyFile.on('click', {action: copyFile, file: event.data}, toWhere);
  };

  var toWhere = function(event) {
    $whereSelect.show();
    $.ajax({
      url: rootURL + '/fs_items/all_directories',
      type: 'GET',
      dataType: 'json'
    })
    .done(function(directories) {
      listDirectories(directories, event);
    });
  };

  var listDirectories = function(result, event) {
    var directories = result.fs_items, $option;
    $whereSelect.empty();
    for(var i = 0; i < directories.length; i++) {
      $option = $('<option>');
      $option.prop('value', directories[i].id);
      $option.text(directories[i].name);

      // Don't like the way I'm passing this callback
      $whereSelect.append($option);
    }
    $whereSelect.on('change', {fileData: event.data.file }, event.data.action);

  };

  var copyFile = function(event) {
    $.ajax({
      url: rootURL + '/fs_items',
      type: 'POST',
      data: {fs_item: { name: event.data.fileData.name,
             kind: event.data.fileData.kind,
             fs_item_id: $whereSelect.val() }},
    })
    .done(function() {
      console.log('File Copied');
    });
    cleanUp();
  };

  var moveFile = function(event) {
    $.ajax({
      url: rootURL + '/fs_items/' + event.data.fileData.id,
      type: 'PATCH',
      data: {fs_item: { fs_item_id: $whereSelect.val() }},
    })
    .done(function() {
      console.log('File Moved');
    });
    cleanUp();
  };

  var cleanUp = function() {
    $whereSelect.hide();
  };

  return {init: init};
})();

$(document).ready(App.init);
