const fs = jest.createMockFromModule('fs');

fs.existsSync = jest.fn().mockImplementation(path => path.startsWith('/existing/'));;

module.exports = fs;