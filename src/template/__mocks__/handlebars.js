const handlebars = jest.createMockFromModule('handlebars');

handlebars.templates = { 'a-template': jest.fn().mockReturnValue("test-template-filled") };

module.exports = handlebars;