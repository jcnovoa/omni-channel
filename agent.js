window.myCPP = window.myCPP || {};

const ccpUrl = "https://fpllex.awsapps.com/connect/ccp#/";
connect.core.initCCP(containerDiv, {
    ccpUrl: ccpUrl,
    loginPopup: true,
    softphone: {
        allowFramedSoftphone: true
    }
});

// connect.contact(subscribeToContactEvents);
// function subscribeToContactEvents(contact) {
//     const callAttributes = contact.getAttributes();
//     const card = callAttributes["EncryptedCreditCard"]["value"];
//     $('#label').text(card);
// }


