
// runnerlist data array for filling in info box
var runnerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#runnerList table tbody').on('click', 'td a.linkshowuser', showRunnerInfo);

    // Add runner button click
    $('#btnAddRunner').on('click', addRunner);

    // sava aka update button
    $('#btnSaveRunner').on('click', saveRunner);

    // DUV lookup button
    $('#btnLookupDuv').on('click', lookupDuv);

    // Gen Startlist button
    $('#btnGenStarterList').on('click', genStartList);

    // Gen email list button
    $('#btnGenEmailList').on('click', genEmailList);

    //$('#btnGenVpList').on('click', genVpList);

    
    // Delete User link click
    $('#runnerList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $('#runnerInfoDeleteBtn').on('click', deleteUser);

    // Edit Runner link click
    $('#runnerList table tbody').on('click', 'td a.linkeditrunner', editRunner);

    //$('select').material_select(); !@#$% ... select just doesn't work !??
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    var summaryContent = '';
    var runnerNum = 1;
    var paidNum = 0;
    var hasPaid;
    var willSleep = 0;
    var numS = 0;
    var numM = 0;
    var numL = 0;
    var numXL = 0;
    
    // jQuery AJAX call for JSON
    $.getJSON( '/runners/runnerlist', function(data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            if (this.paid == "true") {
                hasPaid = "<b>YES</b>";
                paidNum++;
            }
            else {
                hasPaid = "No";
            }
            if ("true" == this.sleep)   willSleep++;
            if ("true" == this.tsizeS)  numS++;
            if ("true" == this.tsizeM)  numM++;
            if ("true" == this.tsizeL)  numL++;
            if ("true" == this.tsizeXL) numXL++;
            
            tableContent += '<tr>';
            tableContent += '<td>' + runnerNum + '</td>';
            tableContent += '<td>' + (this.startnum ? this.startnum : "") + '</td>';
            //tableContent += '<td><a href="#runnerInfoModal" class="linkshowuser"  data-toggle="modal" rel="' + this._id + '">' + this.firstname + ' ' + this.lastname + '</a></td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '">' + this.firstname + ' ' + this.lastname + '</a></td>';
            tableContent += '<td><a id="emailaddress" title="Send mail to ' + this.firstname + '" href="mailto:' + this.email + '">' + this.email + '</a></td>';
            //tableContent += '<td><a id="emailaddress" title="Send mail to ' + this.firstname + '" href="mailto:' + this.email + '">' + '*****' + '</a></td>';
	        tableContent += '<td><a id="duvid" title="Open DUV Stat" href="http://statistik.d-u-v.org/getresultperson.php?runner=' + this.duvid + '">' + this.duvid + '</a></td>';
            tableContent += '<td>' + hasPaid + '</td>';
            tableContent += '<td>' + (this.tsize ? this.tsize : "") + '</td>';
            tableContent += '<td><a href="#" title="Delete Runner" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
	        tableContent += '<td><a href="#" title="Edit Runner Info" class="linkeditrunner" rel="' + this._id + '">edit</a></td>';
            tableContent += '</tr>';
            runnerNum++;
        });

        summaryContent += '<tr><td>Num runners Paid: </td><td>' + paidNum + '</td></tr>';
        summaryContent += '<tr><td>Missing: </td><td>' + (runnerNum - 1 - paidNum) + '</td></tr>';
        summaryContent += '<tr><td>Sleep : </td><td>' + willSleep + '</td></tr>';
        summaryContent += '<tr><td>Size S: </td><td>' + numS + '</td></tr>';
        summaryContent += '<tr><td>Size M: </td><td>' + numM + '</td></tr>';
        summaryContent += '<tr><td>Size L: </td><td>' + numL + '</td></tr>';
        summaryContent += '<tr><td>Size XL: </td><td>' + numXL + '</td></tr>';
        // Inject the whole content string into our existing HTML table
        $('#runnerList table tbody').html(tableContent);
        $('#summaryTable table tbody').html(summaryContent);
    });
};

// http://jsfiddle.net/cwbuecheler/2qEZ2/

function showRunnerInfo2(data) {
    //Populate Info Box
    $('#userInfoStartNum').text(data.startnum);
	$('#userInfoFirstName').text(data.firstname);
	$('#userInfoLastName').text(data.lastname);
	$('#userInfoDuvId').text(data.duvid);
	$('#userInfoEmail').text(data.email);
	$('#userInfoCatGer').text(data.catger);
	$('#userInfoCatInt').text(data.catint);
	$('#userInfoAge').text(data.age);
	$('#userInfoYear').text(data.yearofbirth);
	$('#userInfoBirthday').text(data.birthday);
	$('#userInfoClub').text(data.club);
	$('#userInfoResidence').text(data.residence);
	$('#userInfoNationality').text(data.nationality);
	$('#userInfoHomepage').text(data.homepage);
    $('#userInfoPhone').text(data.phone);
    $('#userInfoMobile').text(data.mobile);
    $('#userInfoPaid').text(data.paid);
    $('#userInfoSleep').text(data.sleep);
    $('#userInfoPacer').text(data.pacer);
    $('#userInfoEarlyStart').text(data.earlystart);
    $('#userInfoSize').text(data.tsize);
}
function fillEditTable(data) {
    $('#editRunner fieldset input#inputid').val(data._id).change();
    $('#editRunner fieldset input#inputStartNum').val(data.startnum).change();
	$('#editRunner fieldset input#inputFirstName').val(data.firstname).change();
	$('#editRunner fieldset input#inputLastName').val(data.lastname).change();
	$('#editRunner fieldset input#inputDuvId').val(data.duvid).show().change();
    $('#editRunner fieldset input#inputEmail').val(data.email).show().change();
	$('#editRunner fieldset input#inputYearOfBirth').val(data.yearofbirth).change();
	$('#editRunner fieldset input#inputDateOfBirth').val(data.birthday).change();
    $('#editRunner fieldset input#inputClub').val(data.club).change();
	$('#editRunner fieldset input#inputResidence').val(data.residence).change();
	$('#editRunner fieldset input#inputNationality').val(data.nationality).change();
	$('#editRunner fieldset input#inputHomepage').val(data.homepage).change();
    $('#editRunner fieldset input#inputPhone').val(data.phone).change();
    $('#editRunner fieldset input#inputMobile').val(data.mobile).change();
	$('#editRunner fieldset input#inputCatGer').val(data.catger).change();
	$('#editRunner fieldset input#inputCatInt').val(data.catint).change();

    console.log("fillEditTable: id="  + data._id);
    console.log("fillEditTable: data.paid="  + data.paid);
    console.log("fillEditTable: data.sleep=" + data.sleep);
    console.log("fillEditTable: data.pacer=" + data.pacer);
    console.log("fillEditTable: size=" + data.tsize);
    
    if ('true' === data.paid)
        $('#editRunner fieldset input#inputPaid1').prop('checked', true).change();
    else
        $('#editRunner fieldset input#inputPaid1').prop('checked', false).change();

    if ('true' === data.sleep)
        $('#editRunner fieldset input#inputSleep1').prop('checked', true).change();
    else
        $('#editRunner fieldset input#inputSleep1').prop('checked', false).change();
    if ('true' === data.pacer)
        $('#editRunner fieldset input#inputPacer1').prop('checked', true).change();
    else
        $('#editRunner fieldset input#inputPacer1').prop('checked', false).change();
    if ('true' === data.earlystart)
        $('#editRunner fieldset input#inputEarlyStart1').prop('checked', true).change();
    else
        $('#editRunner fieldset input#inputEarlyStart1').prop('checked', false).change();

    // $('#editRunner fieldset  input#inputSizeS').prop('checked', data.tsizeS.valueOf()).change();
    // $('#editRunner fieldset  input#inputSizeM').prop('checked', data.tsizeM.valueOf()).change();
    // $('#editRunner fieldset  input#inputSizeL').prop('checked', data.tsizeL.valueOf()).change();
    // $('#editRunner fieldset  input#inputSizeXL').prop('checked', data.tsizeXL.valueOf()).change();

    if ('true' === data.tsizeS)
        $('#editRunner fieldset  input#inputSizeS').prop('checked', true).change();
    else
        $('#editRunner fieldset  input#inputSizeS').prop('checked', false).change();

    if ('true' === data.tsizeM)
        $('#editRunner fieldset  input#inputSizeM').prop('checked', true).change();
    else
        $('#editRunner fieldset  input#inputSizeM').prop('checked', false).change();

    if ('true' === data.tsizeL)
        $('#editRunner fieldset  input#inputSizeL').prop('checked', true).change();
    else
        $('#editRunner fieldset  input#inputSizeL').prop('checked', false).change();

    if ('true' === data.tsizeXL)
        $('#editRunner fieldset input#inputSizeXL').prop('checked', true).change();
    else
        $('#editRunner fieldset input#inputSizeXL').prop('checked', false).change();
}

function showRunnerInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    $.getJSON( '/runners/getuser/' + $(this).attr('rel'), function(data) {
	    // sanity check data -> err msg or empty data!?
	    console.log("showRunnerInfo: duvid=" + data.duvid);

	    //Populate Info Box
        $('#userInfoStartNum').text(data.startnum);
	    $('#userInfoFirstName').text(data.firstname);
	    $('#userInfoLastName').text(data.lastname);
	    $('#userInfoDuvId').text(data.duvid);
	    $('#userInfoEmail').text(data.email);
	    $('#userInfoCatGer').text(data.catger);
	    $('#userInfoCatInt').text(data.catint);
	    $('#userInfoAge').text(data.age);
	    $('#userInfoYear').text(data.yearofbirth);
	    $('#userInfoBirthday').text(data.birthday);
	    $('#userInfoClub').text(data.club);
	    $('#userInfoResidence').text(data.residence);
	    $('#userInfoNationality').text(data.nationality);
	    $('#userInfoHomepage').text(data.homepage);
        $('#userInfoPhone').text(data.phone);
        $('#userInfoMobile').text(data.mobile);
        $('#userInfoPaid').text(data.paid);
        $('#userInfoSleep').text(data.sleep);
        $('#userInfoPacer').text(data.pacer);
        $('#userInfoEarlyStart').text(data.earlystart);
        $('#userInfoSize').text(data.tsize);
    });

    // open the user info modal ...
    $("#myModal").modal('show');

    
    // // Retrieve username from link rel attribute
    // var thisUserName = $(this).attr('rel');

    // // Get Index of object based on id value
    // var arrayPosition = runnerListData.map(function(arrayItem) {
    // 	return arrayItem.username;
    // }).indexOf(thisUserName);
    
    // // Get our User Object
    // var thisUserObject = runnerListData;//runnerListData[arrayPosition];


};

// function genVpList(event) {
//     event.preventDefault();
//     alert('vp list');
//     $('#vpList').toggle();
//     $('#starterList').hide();

// }

function genStartList(event) {
    event.preventDefault();
    var tableContent = '';
    var runnerNum = 1;

    //confirm("Startliste anzeige?");
    // jQuery AJAX call for JSON
    //  $.getJSON( '/runners/runnerlist', function(data) {
    $.getJSON( '/runners/starterlist', function(data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + runnerNum + '</td>';
            tableContent += '<td><a href="http://statistik.d-u-v.org/getresultperson.php?runner=' + this.duvid + '" >'
                + this.firstname + ' ' + this.lastname + '</a></td>';
	        tableContent += '<td>' + this.nationality + '</td>';
            tableContent += '<td>' + this.residence + '</td>';
	        tableContent += '<td>' + this.club + '</td>';
	        tableContent += '<td>' + this.catger + '</td>';
            tableContent += '</tr>';
            runnerNum++;
        });

        // Inject the whole content string into our existing HTML table
        $('#starterList table tbody').html(tableContent);

    });
}

function genEmailList(event) {
    event.preventDefault();
    var emailList = '';

    $.getJSON( '/runners/runnerlist', function(data) {
        $.each(data, function() {
	    console.log(this.email);
	    if (this.email) emailList += this.email + ', ';

	    $('#emailList').html(emailList);
        });

    });
}

function lookupDuv(event) {
    event.preventDefault();
    var id = $('#addRunner fieldset input#inputDuvId').val().trim();

    if (id !== '') {
	var idRegex = /^\d+$/;
	if (idRegex.test(id)) {
	    console.log("lookup duv id: " + id);

	    $.getJSON( '/duv/getrunner/' + id, function(data) {
		console.log("GET /duv/getrunner/duvid=" + id + " callback");
		var runnerData = data;
		console.log("runnerData: duvid=" + data.duvid);
		console.log("runnerData: lastname=" + data.name);
		console.log("runnerData: firstname=" + data.firstname);
		//$('#userInfoFirstName').text(thisUserObject.firstname);
		//$('#userInfoLastName').text(thisUserObject.lastname);
		if (data.name === '') {
		    return false;
		}

		$('#addRunner fieldset input#inputFirstName').val(data.firstname);
		$('#addRunner fieldset input#inputFirstName').focus().trigger('click');
		$('#addRunner fieldset input#inputLastName').val(data.name);
		$('#addRunner fieldset input#inputLastName').focus().trigger('click');
		$('#addRunner fieldset input#inputDuvId').val(data.duvid);
		$('#addRunner fieldset input#inputDuvId').focus().trigger('click');
		$('#addRunner fieldset input#inputDateOfBirth').val(data.dateofbirth);
		$('#addRunner fieldset input#inputDateOfBirth').focus().trigger('click');
		$('#addRunner fieldset input#inputYearOfBirth').val(data.yearofbirth);
		$('#addRunner fieldset input#inputYearOfBirth').focus().trigger('click');
		$('#addRunner fieldset input#inputCatGer').val(data.catger);
		$('#addRunner fieldset input#inputCatGer').focus().trigger('click');
		$('#addRunner fieldset input#inputCatInt').val(data.catint);
		$('#addRunner fieldset input#inputCatInt').focus().trigger('click');
		$('#addRunner fieldset input#inputResidence').val(data.residence);
		$('#addRunner fieldset input#inputResidence').focus().trigger('click');
		$('#addRunner fieldset input#inputNationality').val(data.nationality);
		$('#addRunner fieldset input#inputNationality').focus().trigger('click');
		$('#addRunner fieldset input#inputClub').val(data.club);
		$('#addRunner fieldset input#inputClub').focus().trigger('click');
		$('#addRunner fieldset input#inputHomepage').val(data.homepage);
		$('#addRunner fieldset input#inputHomepage').focus().trigger('click');
		return true;
	    });
	}
	else
	    alert("Ungueltige DUV ID (nur Zahlen!)");
    }
    else
	alert("Keine DUV ID eingegeben!");
    return false;
}

// Add a runner
function addRunner(event) {
    event.preventDefault();

    // some input validation - increase errorCount variable if certain fields are blank
    // need to figure what kind of validation materialize and mongoose can do ... and how
    var errorCount = 0;
    $('#addRunner input').each(function(index, val) {
	    console.log("addrunner, input field: " + val.getAttribute('ID'));
	    console.log($(this).val());

	    // the fields below are optional, do not increment counter
	    var optionalInput = ['inputClub', 'inputDateOfBirth', 'inputDuvId',
			                 'inputEmail', 'inputMobile', 'inputPhone',
			                 'inputHomepage', 'inputCatGer'];//, 'inputCatInt'];
	    if (optionalInput.indexOf(val.getAttribute('ID')) > -1) { return false; }
	
	// if (val.getAttribute('ID') === 'inputClub')        { return false; } // continue;
	// // else validate club
	// if (val.getAttribute('ID') === 'inputDateOfBirth') { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputDuvId')       { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputEmail')       { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputMobile')      { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputPhone')       { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputHomepage')    { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputCatGer')      { return false; } // continue;
	// if (val.getAttribute('ID') === 'inputCatInt')      { return false; } // continue;
	
        if ($(this).val() === '') { errorCount++; }
	    return true;
    });

    // validate input fields ...
    // try mongoose schema validation

    // need to check if runner already exists ... eg. check duvid, first/last name
    
    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // calculate age...database function?!

        var tsizeVal = "";
        if ($('#addRunner fieldset input#inputTsizeS').is(":checked"))  { tsizeVal = "S";  }
        if ($('#addRunner fieldset input#inputTsizeM').is(":checked") ) { tsizeVal = "M";  }
        if ($('#addRunner fieldset input#inputTsizeL').is(":checked") ) { tsizeVal = "L";  }
        if ($('#addRunner fieldset input#inputTsizeXL').is(":checked")) { tsizeVal = "XL"; }
        console.log("addrunner paid?: " + $('#addRunner fieldset input#inputPaid').is(":checked"));
        console.log("addrunner sizes: " + tsizeVal);


        
        // If it is, compile all runner info into one object
        var newUser = {
            'startnum'     : $('#addRunner fieldset input#inputStartNum').val(),
            'firstname'    : $('#addRunner fieldset input#inputFirstName').val(),
            'lastname'     : $('#addRunner fieldset input#inputLastName').val(),
            'duvid'        : $('#addRunner fieldset input#inputDuvId').val(),
            'email'        : $('#addRunner fieldset input#inputEmail').val(),
            'birthday'     : $('#addRunner fieldset input#inputDateOfBirth').val(),
            'yearofbirth'  : $('#addRunner fieldset input#inputYearOfBirth').val(),
	        'catger'       : $('#addRunner fieldset input#inputCatGer').val(),
	        'catint'       : $('#addRunner fieldset input#inputCatInt').val(),
            'residence'    : $('#addRunner fieldset input#inputResidence').val(),
            'nationality'  : $('#addRunner fieldset input#inputNationality').val(),
            'club'         : $('#addRunner fieldset input#inputClub').val(),
	        'homepage'     : $('#addRunner fieldset input#inputHomepage').val(),
            'phone'        : $('#addRunner fieldset input#inputPhone').val(),
            'mobile'       : $('#addRunner fieldset input#inputMobile').val(),
            'paid'         : $('#addRunner fieldset input#inputPaid').is(":checked"),
            'sleep'        : $('#addRunner fieldset input#inputSleep').is(":checked"),
            'pacer'        : $('#addRunner fieldset input#inputPacer').is(":checked"),
            'tsize'        : tsizeVal,
            'tsizeS'       : $('#addRunner fieldset input#inputTsizeS').is(":checked"),
            'tsizeM'       : $('#addRunner fieldset input#inputTsizeM').is(":checked"), 
            'tsizeL'       : $('#addRunner fieldset input#inputTsizeL').is(":checked"), 
            'tsizeXL'      : $('#addRunner fieldset input#inputTsizeXL').is(":checked")
        };

        if (jQuery.type(newUser.tsizeL) === "boolean")
            console.log("tsizeX is a boolean");
        if (jQuery.type(newUser.tsizeL) === "string")
            console.log("tsizeX is a string");
        


        // Use AJAX to post the object to our addrunner service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/runners/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
	    // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addRunner fieldset input').val('');
                $('#addRunner fieldset    input#inputPaid').prop('checked', false);
                $('#addRunner fieldset   input#inputSleep').prop('checked', false);
                $('#addRunner fieldset   input#inputPacer').prop('checked', false);
                $('#addRunner fieldset  input#inputTsizeS').prop('checked', false);
                $('#addRunner fieldset  input#inputTsizeM').prop('checked', false);
                $('#addRunner fieldset  input#inputTsizeL').prop('checked', false);
                $('#addRunner fieldset input#inputTsizeXL').prop('checked', false);
                
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all required (*) fields');
        return false;
    };
    $('#maintabbar a[href="#home"]').tab('show');
    return true;
};


// Delete User
function deleteUser(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/runners/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
    return true;
}

// save changes to a runner
function saveRunner(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to save changes for this runner?');

    var runnerId = $('#editRunner fieldset input#inputid').val();
    console.log("saveRunner: id=" + runnerId);    

//    $.getJSON( '/runners/update/' + runnerId , function(data) {
//
//    });

    // If it is, compile all runner info into one object
    var tsizeVal = "";
    if ($('#editRunner fieldset input#inputSizeS').is(":checked"))  { tsizeVal = "S";  }
    if ($('#editRunner fieldset input#inputSizeM').is(":checked") ) { tsizeVal = "M";  }
    if ($('#editRunner fieldset input#inputSizeL').is(":checked") ) { tsizeVal = "L";  }
    if ($('#editRunner fieldset input#inputSizeXL').is(":checked")) { tsizeVal = "XL"; }
    console.log("saveRunner: tsize=" + tsizeVal);    

    var runner = {
        'startnum'     : parseInt($('#editRunner fieldset input#inputStartNum').val()),
        'firstname'    : $('#editRunner fieldset input#inputFirstName').val(),
        'lastname'     : $('#editRunner fieldset input#inputLastName').val(),
        'duvid'        : $('#editRunner fieldset input#inputDuvId').val(),
        'email'        : $('#editRunner fieldset input#inputEmail').val(),
        'birthday'     : $('#editRunner fieldset input#inputDateOfBirth').val(),
        'yearofbirth'  : $('#editRunner fieldset input#inputYearOfBirth').val(),
	    'catger'       : $('#editRunner fieldset input#inputCatGer').val(),
	    'catint'       : $('#editRunner fieldset input#inputCatInt').val(),
        'residence'    : $('#editRunner fieldset input#inputResidence').val(),
        'nationality'  : $('#editRunner fieldset input#inputNationality').val(),
        'club'         : $('#editRunner fieldset input#inputClub').val(),
	    'homepage'     : $('#editRunner fieldset input#inputHomepage').val(),
        'phone'        : $('#editRunner fieldset input#inputPhone').val(),
        'mobile'       : $('#editRunner fieldset input#inputMobile').val(),
        'paid'         : $('#editRunner fieldset input#inputPaid1').is(":checked"),
        'sleep'        : $('#editRunner fieldset input#inputSleep1').is(":checked"),
        'pacer'        : $('#editRunner fieldset input#inputPacer1').is(":checked"),
        'earlystart'   : $('#editRunner fieldset input#inputEarlyStart1').is(":checked"),
        'tsize'        : tsizeVal,
        'tsizeS'       : $('#editRunner fieldset input#inputSizeS').is(":checked"),
        'tsizeM'       : $('#editRunner fieldset input#inputSizeM').is(":checked"), 
        'tsizeL'       : $('#editRunner fieldset input#inputSizeL').is(":checked"), 
        'tsizeXL'      : $('#editRunner fieldset input#inputSizeXL').is(":checked")
    };
               
               

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our update
        $.ajax({
            type: 'PUT',
            data: runner,
            url: '/runners/update/' + runnerId
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }

    $('#maintabbar a[href="#home"]').tab('show');
    return true;
}

// Edit a runner
function editRunner(event) {
    // Prevent Link from Firing
    event.preventDefault();
    var runnerId = $(this).attr('rel');
    
    $.getJSON( '/runners/getuser/' + runnerId, function(data) {
	    // sanity check data -> err msg or empty data!?
        
	    console.log("edit runner id: " + data._id);
        fillEditTable(data);
	    //showRunnerInfo2(data);
    });

    $('#maintabbar a[href="#menu_edit"]').tab('show');
}
