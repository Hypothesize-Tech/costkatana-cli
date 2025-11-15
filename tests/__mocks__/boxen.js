// Mock for boxen - CommonJS compatible
const mockBoxen = (text, options = {}) => {
  // Simple mock that just returns the text with some padding
  const lines = text.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length));
  const border = '─'.repeat(maxLength + 4);
  
  return [
    `┌${border}┐`,
    ...lines.map(line => `│  ${line.padEnd(maxLength)}  │`),
    `└${border}┘`,
  ].join('\n');
};

module.exports = mockBoxen;
module.exports.default = mockBoxen;

