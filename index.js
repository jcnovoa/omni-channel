document.getElementById("wisdom").focus();

AWS.config.update({ region: 'us-east-1' });
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'us-east-1:b65f5b61-d42d-49b4-936c-def722f6c45f' });

var lexruntime = new AWS.LexRuntime();
var lexUserId = 'chatbot-demo' + Date.now();
var sessionAttributes = {};

fakeLexResponse('Hi Mr. Novoa, how can I help you.',1500);
fakeLexResponse("I can help with things like 'dispute a balance'\
                 ,'change notification settings', or 'talk to a \
                 live agent.' How can I help?", 3500);

// Demo Lex Response (initial response)
function fakeLexResponse(lexMsg, ms_delay){
    setTimeout( function(){
        showResponse({ message: lexMsg})
    }, ms_delay);
}

function createCheckboxDiv(tag_name){
    var div = document.createElement('div');
    div.className = "w-full flex items-center justify-center mb-3";
    // Create parent span
    var span = document.createElement('span');
    span.id = "span-" + tag_name;
    span.className = "checkbox border rounded-full border-grey flex items-center w-12";
    // Create Input Checkbox
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = "input-"+tag_name;
    input.name = tag_name;
    input.className = "checkbox-input cursor-pointer bg-white appearance-none rounded-full border w-6 h-6 border-grey shadow-inner shadow";
    input.onclick = function(){
        this.parentElement.classList.toggle('active');
    };
    // Create Label
    var label = document.createElement('label');
    label.className = "text-color-scheme font-bold mr-2 text-lg";
    label.innerText = tag_name.replace(/^\w/, c => c.toUpperCase());;
    // Append input to span
    span.appendChild(input);
    // Append label and span to div
    div.appendChild(label);
    div.appendChild(span);
    return div;
}

// Created checkbox element
function createCheckboxContainer(tag_names, lex_res_send, header_text){
    var conversationDiv = document.getElementById('conversation');
    // Create Checkbox Container
    var checkboxContainer = document.createElement('div');
    checkboxContainer.className = "checkboxDiv flex flex-wrap items-center p-4 bg-white rounded shadow mb-3 shadow-lg";
    // Create Header
    var header = document.createElement('h2');
    header.innerText = header_text + " Settings";
    header.className = "text-color-scheme text-2xl text-center mb-4 font-bold w-full border-b-2 border-color-scheme border-dashed pb-2";
    // Create Button
    var btn = document.createElement('button');
    btn.innerText = "Save";
    btn.type = "submit";
    btn.id = "checkboxButton-" + header_text;
    btn.className = "flex-grow p-2 bg-color-scheme rounded text-white font-bold text-lg";
    
    // Append children to checkboxContainer
    checkboxContainer.appendChild(header);
    var i;
    for (i = 0; i < tag_names.length; i++) { 
        checkboxContainer.appendChild(createCheckboxDiv(tag_names[i]));
    }
    checkboxContainer.appendChild(btn);
    conversationDiv.appendChild(checkboxContainer);

    document.getElementById(btn.id).addEventListener("click", function(){
        getCheckboxResponse(tag_names);
        pushChat(lex_res_send);
    });
    // Slow Scroll Transition
    $('#conversation').animate({
        scrollTop: conversationDiv.scrollHeight
        }, 2000);
}
// Gets value from checkboxes
function getCheckboxResponse(tag_names){
    var i;
    for (i = 0; i < tag_names.length; i++) { 
        sessionAttributes[tag_names[i]] = document.getElementById("input-"+tag_names[i]).checked.toString(); 
    }
}

// use inputText when you want to fullfill
function pushChat(inputText='') {

    var wisdomText = document.getElementById('wisdom');
    wisdomText.value = wisdomText.value || inputText;

    if ( wisdomText && wisdomText.value && wisdomText.value.trim().length > 0 ) {

        // disable input to show we're sending it
        var wisdom = wisdomText.value.trim();
        wisdomText.value = '...';
        wisdomText.locked = true;

        // send it to the Lex runtime
        var params = {
            botAlias: '$LATEST',
            botName: 'FPL',
            inputText: wisdom,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };

        if(!inputText){
            showRequest(wisdom);
        }

        lexruntime.postText(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                showError('Error:  ' + err.message + ' (see console for details)')
            }
            if (data) {
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                showResponse(data);
                // show response and/or error/dialog status
            }
            // re-enable input
            
            // Troubelshoot
            // createCheckboxContainer(['outage','account','maintenance'], 'yes');
            wisdomText.value = '';
            wisdomText.locked = false;
        });
    }
    // we always cancel form submission
    return false;
}

function showRequest(daText) {
    var conversationDiv = document.getElementById('conversation');
    var requestPara = document.createElement("P");
    
    requestPara.className = 'userRequest border-2 border-white shadow bg-color-scheme text-white';
    requestPara.appendChild(document.createTextNode(daText));

    var chatDiv = document.createElement("div");
    chatDiv.className = "mb-3 flex items-center justify-end userResponseDiv";

    var icon = document.createElement("i");
    icon.className = "fas fa-user-tie text-white bg-color-scheme text-center rounded-full h-10 w-10 text-xl py-2 border-2 border-white shadow";

    chatDiv.appendChild(requestPara);
    chatDiv.appendChild(icon);
    conversationDiv.appendChild(chatDiv);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showError(daText) {
    var conversationDiv = document.getElementById('conversation');
    var errorPara = document.createElement("P");
    errorPara.className = 'lexError';
    errorPara.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(errorPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showResponse(lexResponse) {

    // Overwrite User input for balance ammount: Clean this up later
    if (lexResponse.message.includes("(in dollars)")){
        pushChat('264.03');
        return;
    }

    var conversationDiv = document.getElementById('conversation');
    var responsePara = document.createElement("P");
    responsePara.className = 'lexResponse border-color-scheme border-2 shadow bg-white text-color-scheme';

    if (lexResponse.message) {
        responsePara.appendChild(document.createTextNode(lexResponse.message));
        responsePara.appendChild(document.createElement('br'));
    }
    if (lexResponse.dialogState === 'ReadyForFulfillment') {
        responsePara.appendChild(document.createTextNode('Ready for fulfillment'));
        // TODO:  show slot values
    }  

    var chatDiv = document.createElement("div");
    chatDiv.className = "mb-3 flex items-center justify-start lexResponseDiv";
    var icon = document.createElement("i");
    icon.className = "fas fa-robot text-center rounded-full h-10 w-10 text-xl py-2 text-color-scheme bg-white border-2 border-color-scheme shadow";

    chatDiv.appendChild(icon);
    chatDiv.appendChild(responsePara);
    conversationDiv.appendChild(chatDiv);

    if (lexResponse.message == "Update your alert settings from the following options:"){
        createCheckboxContainer(['outage','account','maintenance'], 'yes', 'Alert');
    }else if (lexResponse.message == "Update your notifications settings from the following options:"){
        createCheckboxContainer(['phone call','email','text message'], 'text', 'Notification');
    }else{
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }

}