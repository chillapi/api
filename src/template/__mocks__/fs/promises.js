const fs = jest.createMockFromModule('fs/promises');

fs.writeFile = jest.fn();
fs.readFile = jest.fn().mockImplementation(path => ({
    toString: jest.fn().mockImplementation(() => path === '/existing/path/modified' ? 'some-other-content' : 'test-template-filled')
}));

module.exports = fs;