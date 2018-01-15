exports.googleCloud = function (message,registrationId,gcmID) {
    var message = new gcm.Message({data: {message: message}});
    var regTokens = [registrationId];
    var sender = new gcm.Sender(gcmID());
    sender.send(message, { registrationTokens: regTokens }, function (err, response) {

        if (err){

            console.error(err);
            callback(constants.error.msg_send_failure);

        } else 	{

            console.log(response);
            callback(constants.success.msg_send_success);
        }

    });
}