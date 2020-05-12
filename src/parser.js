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
    const regex = /\w+ \w+ \w+ ?\w+ ?\w+ (?<username>\w+) \w+ (?<ip>.*) \w+ (?<port>\w+) \w+/;
    return regex.exec(message)?.groups;
}

export default parseAuthFailedMessage;
