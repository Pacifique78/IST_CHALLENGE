const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const orderMap = {
      'auth.test.ts': 1,
      'todos.test.ts': 2,
    };

    return tests.sort((testA, testB) => {
      const fileA = testA.path.split('/').pop() || '';
      const fileB = testB.path.split('/').pop() || '';
      
      const orderA = orderMap[fileA] || Infinity;
      const orderB = orderMap[fileB] || Infinity;

      if (orderA === orderB) {
        // If same priority, maintain stable sort based on full path
        return testA.path.localeCompare(testB.path);
      }
      
      return orderA - orderB;
    });
  }
}

module.exports = CustomSequencer;