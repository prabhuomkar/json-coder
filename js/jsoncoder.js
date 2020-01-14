// Created by Omkar Prabhu on 8/7/2017

$(document).ready(function() {
  /* Clears entry */
  var ans = '';
  $('.clr-field').on('click', function() {
    $('#json-response').val('');
    $('#pretty-code').html('Paste some json data in the textbox');
    $('#java-code').html('Get your json data for android here');
    ans = '';
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

  /* Contributed by Vipul Singh Raghuvanshi[https://github.com/vipul-08]
  ** Following is the recursive algorithm to take a json object string and get the java parsing code */

  function parseJSON(jsonResponse) {
    var jparsed = JSON.parse(jsonResponse);
    if(jparsed instanceof Object) {
      ans = ans + "JSONObject jsonObject = new JSONObject('your string here');" + "<br>";
      parserJSON(JSON.parse(jsonResponse), "jsonObject");
    } else {
      ans = ans + "Not a JSON Object" + "<br>";
    }
    $('#java-code').html(ans);
  }

  function parserJSON(jparsed, label) {
    if (jparsed instanceof Array) {
      ans = ans + "for(JSONObject insideObject:  " + label + ") {" + "<br>";
      parserJSON(jparsed[0], "insideObject");
      ans = ans +  "}<br>";
    } else if (jparsed instanceof Object) {
      var count = Object.keys(jparsed).length;
      for(var i = 0 ; i < count ; i++) {
        var objNow = Object.keys(jparsed)[i];
        var objVal = Object.values(jparsed)[i];
        if (objVal instanceof Array) {
          if (objVal[0] instanceof Object) {
            ans = ans + "JSONArray " + objNow.replace(/[^A-Za-z]/g, "") + " = " + label + ".getJSONArray(\""+ objNow +"\");"+ "<br>";
            parserJSON(objVal, objNow);
          }
          else {
            ans = ans + "JSONArray " + objNow.replace(/[^A-Za-z]/g, "") + "Json = " + label + ".getJSONArray(\""+ objNow +"\");"+ "<br>";
            ans = ans + getType(objVal[0])+"[] " + objNow.replace(/[^A-Za-z]/g, "") + " = new " + getType(objVal[0]) + "[" + objNow.replace(/[^A-Za-z]/g, "") + "Json.length()" + "];" + "<br>";
            ans = ans + "for(int i = 0 ; i < " + objNow.replace(/[^A-Za-z]/g, "") + "Json.length() ; i++)"+"<br>";
            ans = ans + objNow.replace(/[^A-Za-z]/g, "") + "[i] = " + objNow.replace(/[^A-Za-z]/g, "") + "Json.get" + getType(objVal[0]) + "(i);" + "<br>";
          }
        }
        else if (objVal instanceof Object) {
          ans = ans + "JSONObject " + objNow.replace(/[^A-Za-z]/g, "") + " = " + label + ".getJSONObject(\""+ objNow +"\");"+ "<br>";
          parserJSON(objVal, objNow);
        } 
        else {
          ans = ans + getType(objVal) + " " + objNow.replace(/[^A-Za-z]/g, "") + " = " + label + "." + getAction(objVal) + "(\"" + objNow + "\");" + "<br>";
        }
      }
    }
  }

  /* If you will ask me process to impress a process
  ** I will never come out of this recursion... */

  /* Actions */
  $('#submit-json-btn').on('click', function() {
     var response = $('#json-response').val();
     ans = '';
     if(!response == '') {
      if(checkJSON(response)) {
        parseJSON(response);
      } else {
        $('#form-response').html('<div class="alert alert-dismissible alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> There is some error in your JSON Response! </div>');
      }
     } else {
        $('#form-response').html('<div class="alert alert-dismissible alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> Paste a valid JSON file or url</div>');
        setTimeout(function() {
          $('#form-response').children().fadeOut();
        }, 4000);
      }
  });
});