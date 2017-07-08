// Created by Omkar Prabhu on 8/7/2017

/* check JSON Response is okay or not */
function checkJSON(jsonResponse) {
    try {
        JSON.parse(jsonResponse);
        return true;
    } catch(e) {
        return false;
    }
}

var JOB = 'JSONObject';
var JOA = 'JSONArray';

/* which parses JSON and gives code */
function parseJSON(jsonResponse) {
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
            javaCode += JOB+' insideObject = '+objNow+'.getJSONObject(i);<br>';
            var keys = Object.keys(jparsed[objNow][0]).length;
            for(var j = 0; j < keys; j++) {
                inobjNow = Object.keys(jparsed[objNow][0])[j];
                javaCode += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String '+inobjNow+' = insideObject.getString("'+inobjNow+'")<br>';
            }
            javaCode += '}';
        } else {
            javaCode += 'String '+objNow+' = jsonObject.getString("'+objNow+'");<br>';
        }
    }
    // Send the code
    $('#java-code').html(javaCode);
}

/* Actions */
$('#submit-json-btn').click(function() {
   var response = $('#json-response').val();
   if(!response == '') {
       if(checkJSON(response)) {
           parseJSON(response);
       } else {
           $('#form-response')
               .html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> There is some error in your JSON Response! </div>');
       }
   }
});
