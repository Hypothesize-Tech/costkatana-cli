import { logger } from '../../src/utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    // Reset logger level before each test
    logger.setLevel('info');
  });

  describe('setLevel', () => {
    it('should set debug level correctly', () => {
      logger.setLevel('debug');
      // Test that debug messages are now visible
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.debug('test debug message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should set info level correctly', () => {
      logger.setLevel('info');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('test info message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should set warn level correctly', () => {
      logger.setLevel('warn');
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      logger.warn('test warn message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should set error level correctly', () => {
      logger.setLevel('error');
      const spy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('test error message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should set success level correctly', () => {
      logger.setLevel('success');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.success('test success message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('log levels', () => {
    it('should not log debug messages when level is info', () => {
      logger.setLevel('info');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.debug('debug message');
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log info messages when level is info', () => {
      logger.setLevel('info');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('info message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log warn messages when level is warn', () => {
      logger.setLevel('warn');
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      logger.warn('warn message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log error messages when level is error', () => {
      logger.setLevel('error');
      const spy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('error message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log success messages when level is success', () => {
      logger.setLevel('success');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.success('success message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('message formatting', () => {
    it('should format messages with timestamp and level', () => {
      logger.setLevel('info');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('test message');
      
      const call = spy.mock.calls[0][0];
      expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\]/);
      expect(call).toContain('test message');
      
      spy.mockRestore();
    });

    it('should handle multiple arguments', () => {
      logger.setLevel('info');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('test message', { key: 'value' }, 123);
      
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] test message/),
        { key: 'value' },
        123
      );
      
      spy.mockRestore();
    });
  });

  describe('special methods', () => {
    it('should log messages directly', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.log('direct message');
      expect(spy).toHaveBeenCalledWith('direct message');
      spy.mockRestore();
    });

    it('should print messages directly', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.print('print message');
      expect(spy).toHaveBeenCalledWith('print message');
      spy.mockRestore();
    });

    it('should clear console', () => {
      const spy = jest.spyOn(console, 'clear').mockImplementation();
      logger.clear();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('spinner methods', () => {
    it('should handle startSpinner in debug mode', () => {
      logger.setLevel('debug');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      const result = logger.startSpinner('Starting task');
      expect(result).toBe('Starting task');
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Starting: Starting task'));
      spy.mockRestore();
    });

    it('should handle stopSpinner in debug mode', () => {
      logger.setLevel('debug');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.stopSpinner('Completed task');
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Completed: Completed task'));
      spy.mockRestore();
    });

    it('should not log spinner messages when not in debug mode', () => {
      logger.setLevel('info');
      const spy = jest.spyOn(console, 'log').mockImplementation();
      logger.startSpinner('Starting task');
      logger.stopSpinner('Completed task');
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
}); 