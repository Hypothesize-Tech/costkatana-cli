// Mock for ora - CommonJS compatible
const createMockSpinner = () => {
  const spinner = {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    info: jest.fn().mockReturnThis(),
    text: '',
    color: 'cyan',
    isSpinning: false,
  };
  return spinner;
};

const mockOra = jest.fn((options) => {
  const spinner = createMockSpinner();
  if (typeof options === 'string') {
    spinner.text = options;
  } else if (options && options.text) {
    spinner.text = options.text;
  }
  return spinner;
});

module.exports = mockOra;
module.exports.default = mockOra;

