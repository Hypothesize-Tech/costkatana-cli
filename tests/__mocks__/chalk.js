// Mock for chalk - CommonJS compatible
const mockChalk = (text) => text;

mockChalk.red = (text) => text;
mockChalk.green = (text) => text;
mockChalk.yellow = (text) => text;
mockChalk.blue = (text) => text;
mockChalk.cyan = (text) => text;
mockChalk.magenta = (text) => text;
mockChalk.white = (text) => text;
mockChalk.gray = (text) => text;
mockChalk.grey = (text) => text;
mockChalk.black = (text) => text;

mockChalk.bold = (text) => text;
mockChalk.dim = (text) => text;
mockChalk.italic = (text) => text;
mockChalk.underline = (text) => text;

// Chained methods
mockChalk.red.bold = (text) => text;
mockChalk.green.bold = (text) => text;
mockChalk.yellow.bold = (text) => text;
mockChalk.blue.bold = (text) => text;
mockChalk.cyan.bold = (text) => text;
mockChalk.magenta.bold = (text) => text;
mockChalk.white.bold = (text) => text;
mockChalk.gray.bold = (text) => text;

module.exports = mockChalk;
module.exports.default = mockChalk;

