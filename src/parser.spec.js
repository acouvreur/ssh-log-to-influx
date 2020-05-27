import parseAuthFailedMessage from './parser.js'

const IPv6AuthMessage = 'Failed password for username from 2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0 port 61832 ssh2'
const IPv6AuthMessageInvalidUsername = 'Failed password for invalid user username from 2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0 port 61832 ssh2'
const IPv4AuthMessage = 'Failed password for username from 192.168.0.0 port 61832 ssh2'
const IPv4AuthMessageInvalidUsername = 'Failed password for invalid user username from 192.168.0.0 port 61832 ssh2'
const InvalidUser = 'Invalid user username from 192.168.0.0 port 38124'
const DisconnectedFromAuthenticating = 'Disconnected from authenticating user root 170.150.72.28 port 60520 [preauth]'

describe('A parser', () => {
    it('should extract username from \'Failed password for username from 2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv6AuthMessage).username).toEqual('username')
    })

    it('should extract IPv6 from \'Failed password for username from 2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv6AuthMessage).ip).toEqual('2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0')
    })

    it('should extract IPv4 from \'Failed password for username from 192.168.0.0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv4AuthMessage).ip).toEqual('192.168.0.0')
    })

    it('should extract port from \'Failed password for username from 192.168.0.0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv4AuthMessage).port).toEqual('61832')
    })

    it('should extract username from \'Failed password for invalid username from 2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv6AuthMessageInvalidUsername).username).toEqual('username')
    })

    it('should extract IPv6 from \'Failed password for invalid username from 2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv6AuthMessageInvalidUsername).ip).toEqual('2a01:cb1d:620:7a00:6cb4:1bd9:29b3:a9a0')
    })

    it('should extract IPv4 from \'Failed password for invalid username from 192.168.0.0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv4AuthMessageInvalidUsername).ip).toEqual('192.168.0.0')
    })

    it('should extract port from \'Failed password for invalid username from 192.168.0.0 port 61832 ssh2\'', () => {
        expect(parseAuthFailedMessage(IPv4AuthMessageInvalidUsername).port).toEqual('61832')
    })

    it('should extract username from \'Invalid user username from 192.168.0.0 port 38124\'', () => {
        expect(parseAuthFailedMessage(InvalidUser).username).toEqual('username')
    })

    it('should extract IP from \'Invalid user username from 192.168.0.0 port 38124\'', () => {
        expect(parseAuthFailedMessage(InvalidUser).ip).toEqual('192.168.0.0')
    })

    it('should extract port from \'Invalid user username from 192.168.0.0 port 38124\'', () => {
        expect(parseAuthFailedMessage(InvalidUser).port).toEqual('38124')
    })

    it('should extract username from \'Disconnected from authenticating user root 170.150.72.28 port 60520 [preauth]\'', () => {
        expect(parseAuthFailedMessage(DisconnectedFromAuthenticating).username).toEqual('root')
    })

    it('should extract IP from \'Disconnected from authenticating user root 170.150.72.28 port 60520 [preauth]\'', () => {
        expect(parseAuthFailedMessage(DisconnectedFromAuthenticating).ip).toEqual('170.150.72.28')
    })

    it('should extract port from \'Disconnected from authenticating user root 170.150.72.28 port 60520 [preauth]\'', () => {
        expect(parseAuthFailedMessage(DisconnectedFromAuthenticating).port).toEqual('60520')
    })

})