AWS.config.update({ region: 'us-east-1' });
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'us-east-1:b65f5b61-d42d-49b4-936c-def722f6c45f' });
var lambda = new AWS.Lambda({ region: 'us-east-1', apiVersion: '2015-03-31' });

function randomTime() {
    var num =  Math.floor(Math.random() * 10) + 7;
    return [num,0]
}

$(document).ready(function () {

    $(".datepicker").click(function (e){
        $('.datepicker').pickadate({
            weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            showMonthsShort: true,
            min: 0,
            max: +60,
            disable: [
                1, 7,
                new Date(2018,7,22), new Date(2018,7,23), new Date(2018,7,25), 
                new Date(2018,7,27), new Date(2018,7,30), new Date(2018,7,31),
                new Date(2018,8,3), new Date(2018,8,4), new Date(2018,8,11),
                new Date(2018,8,13), new Date(2018,8,14), new Date(2018,8,17)
            ]
        });
    });
    $(".timepicker").click(function (e){
        $('.timepicker').pickatime({
            interval: 60,
            min: [7,0],
            max: [17,0],
            disable: [
                randomTime(), randomTime(), 
                randomTime(), randomTime(),
                randomTime(), randomTime(),
                randomTime(), randomTime(),
            ]
        });
    });
    $("#form").submit(function (e) {
        
        $("#res-confirmation").addClass('active');

        e.preventDefault();
        var date = $("#date").val();
        var time = $("#time").val();
        var payload = {
            "date": date,
            "time": time,
        }
        var pullParams = {
            FunctionName: 'fplCalendarRequest',
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify(payload)
        }
        lambda.invoke(pullParams, function (error, data) {
            $("#label").text(data.Payload);
            $("#label-details").text(date + " at " + time);
        });
    });
});
