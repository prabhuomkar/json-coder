// Created by Omkar Prabhu on 8/7/2017
$(document).ready(function() {
  /* Clears entry */
  var ans = '';
  var variables = [];
  $('.clr-field').on('click', function() {
    $('#json-response').val('');
    $('#pretty-code').html('Paste some json data in the textbox');
    $('#java-code').html('Get your json data for android here');
    ans = '';
    variables = [];
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
      ans = ans + "JSONObject jsonObject = new JSONObject('your string here');" + "\n";
      variables.push("jsonObject");
      parserJSON(JSON.parse(jsonResponse), "jsonObject");
    } else {
      ans = ans + "Not a JSON Object" + "\n";
    }
    $('#java-code').html(js_beautify(ans));
  }

  function getVariable(variable) {
    if(variables.includes(variable)) {
      var i = 1;
      while(true) {
        if(variables.includes(variable+i)) {
          i++;
          continue;
        }
        else {
          variable = variable + i;
          variables.push(variable);
          return variable;
        }
      }
    }
    variables.push(variable);
    return variable;
  }

  function parserJSON(jparsed, label) {
    if (jparsed instanceof Array) {
      var variable = getVariable("insideObject");
      ans = ans + "for(JSONObject " + variable + ":  " + label + ") {" + "\n";
      parserJSON(jparsed[0], variable);
      ans = ans +  "}\n";
    } else if (jparsed instanceof Object) {
      var count = Object.keys(jparsed).length;
      for(var i = 0 ; i < count ; i++) {
        var objNow = Object.keys(jparsed)[i];
        var objVal = Object.values(jparsed)[i];
        if (objVal instanceof Array) {
          if (objVal[0] instanceof Object) {
            var variable = getVariable(objNow.replace(/[^A-Za-z]/g, ""));
            ans = ans + "JSONArray " + variable + " = " + label + ".getJSONArray(\""+ objNow +"\");"+ "\n";
            parserJSON(objVal, variable);
          }
          else {
            var variable = getVariable(objNow.replace(/[^A-Za-z]/g, ""));
            ans = ans + "JSONArray " + variable + "Json = " + label + ".getJSONArray(\""+ objNow +"\");"+ "\n";
            ans = ans + getType(objVal[0])+"[] " + variable + " = new " + getType(objVal[0]) + "[" + variable + "Json.length()" + "];" + "\n";
            var nv = getVariable("i");
            ans = ans + "for(int " + nv + " = 0 ; " + nv + " < " + variable + "Json.length() ; " + nv + "++) {"+"\n";
            ans = ans + variable + "[i] = " + variable + "Json.get" + getType(objVal[0]) + "(" + nv + ");" + "\n" + "}" + "\n";
          }
        }
        else if (objVal instanceof Object) {
          var variable = getVariable(objNow.replace(/[^A-Za-z]/g, ""));
          ans = ans + "JSONObject " + variable + " = " + label + ".getJSONObject(\""+ objNow +"\");"+ "\n";
          parserJSON(objVal, variable);
        } 
        else {
          var variable = getVariable(objNow.replace(/[^A-Za-z]/g, ""));
          ans = ans + getType(objVal) + " " + variable + " = " + label + "." + getAction(objVal) + "(\"" + objNow + "\");" + "\n";
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
     variables = [];
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