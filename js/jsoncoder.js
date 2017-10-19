// Created by Omkar Prabhu on 8/7/2017

$(document).ready(function() {
  /* Clears entry */
  $('.clr-field').on('click', function() {
    $('#json-response').val('');
    $('#pretty-code').html('Paste some json data in the textbox');
    $('#java-code').html('Get your json data for android here');
  });

  /* check JSON Response is okay or not */
  function checkJSON(jsonResponse) {
    try {
      var parsedJSON = JSON.parse(jsonResponse);
      var prettyJSON = JSON.stringify(parsedJSON, null, 4);
      $('#pretty-code').css('display', '');
      $('#pretty-code').html(prettyJSON);
      return true;
    } catch(e) {
        return false;
    }
  }

  var JOB = 'JSONObject';
  var JOA = 'JSONArray';

  function checkIfObject(jsonResponse) {
    if(jsonResponse instanceof Object) return true;
    return false;
  }

  function checkIfArray(jsonResponse) {
    if(jsonResponse instanceof Array) return true;
    return false;
  }

  function getAction(obj) {
    if(Number.isInteger(obj)) {
      var signCode = 'getInteger';
    } else {
      var signCode = 'optString';
    }
    return signCode;
  }

  function getType(obj) {
    if(Number.isInteger(obj)) {
      var signCode = 'Integer';
    } else {
      var signCode = 'String';
    }
    return signCode;
  }

  /* which parses JSON and gives code */
  function parseJSON(jsonResponse) {
    var scrollPos =  $('#show-box').offset().top;
    $(window).scrollTop(scrollPos);
    var javaCode = JOB+' jsonObject = new '+JOB+'(your string here);<br>';
    // Handle the parser to code here
    var jparsed = JSON.parse(jsonResponse);
    // Count
    var obj = Object.keys(jparsed).length;
    var countObjects = obj;
    for(var i = 0; i < countObjects; i++) {
      var objNow = Object.keys(jparsed)[i];
      if(jparsed[objNow] instanceof Array) {
          javaCode += JOA+' '+objNow+' = jsonObject.getArray("'+objNow+'");<br>';
          javaCode += 'for(int i = 0; i < '+objNow+'.length(); i++) {<br>';
          // Get objects inside array
          javaCode += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+JOB+' insideObject = '+objNow+'.getJSONObject(i);<br>';
          var keys = Object.keys(jparsed[objNow][0]).length;
          for(var j = 0; j < keys; j++) {
              inobjNow = Object.keys(jparsed[objNow][0])[j];
              inobjVal = Object.values(jparsed[objNow][0])[j];
              javaCode += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getType(inobjVal)+' '+inobjNow+' = insideObject.'+getAction(inobjVal)+'("'+inobjNow+'");<br>';
          }
          javaCode += '}<br>';
      } else {
          javaCode += 'String '+objNow+' = jsonObject.optString("'+objNow+'");<br>';
      }
    }
    // Send the code
    $('#java-code').html(javaCode);
  }

  /* Actions */
  $('#submit-json-btn').on('click', function() {
     var response = $('#json-response').val();
     if(!response == '') {
      if(checkJSON(response)) {
        parseJSON(response);
      } else {
        $('#form-response').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> There is some error in your JSON Response! </div>');
      }
     } else {
        $('#form-response').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> Paste a valid JSON file or url</div>');
        setTimeout(function() {
          $('#form-response').children().fadeOut();
        }, 4000);
      }
  });
});