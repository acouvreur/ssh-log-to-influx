/**
 * @typedef AuthMessageEntry
 * @property {String} username
 * @property {String} ip
 * @property {String} port
 */

/**
 * Parse an SSH auth failed from rsyslog to JSON object.
 * It extracts :
 *  - username
 *  - ip
 *  - port
 * @param {String} message Log message
 * @returns {AuthMessageEntry}
 */
const parseAuthFailedMessage = (message) => {
    
    message = message.trim();
    console.log(message)

    if(message.startsWith('Failed')) {
        const regex = /\w+ \w+ \w+ ?\w+ ?\w+ (?<username>\w+) \w+ (?<ip>.*) \w+ (?<port>\w+) \w+/;
        return regex.exec(message)?.groups;
    } else if(message.startsWith('Invalid')) {
        const regex = /\w+ \w+ (?<username>\w+) \w+ (?<ip>.*) \w+ (?<port>\w+)/;
        return regex.exec(message)?.groups;
    } else if(message.startsWith('Disconnected from')) {
        const regex = /\w+ \w+ \w+ \w+ (?<username>\w+) (?<ip>.*) \w+ (?<port>\w+) .*/;
        return regex.exec(message)?.groups;
    }
    return null;
}

export default parseAuthFailedMessage;
