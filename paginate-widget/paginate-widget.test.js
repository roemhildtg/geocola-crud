import q from 'steal-qunit';
import can from 'can';

import { ViewModel } from './paginate-widget';

let vm;

q.module('paginate-widget.ViewModel', {
  beforeEach() {
    vm = new ViewModel();
  },
  afterEach() {
    vm = null;
  }
});

test('hasNext get()', assert => {
  vm.attr('pages', 10);
  vm.attr('activePageIndex', 0);
  assert.equal(vm.attr('hasNext'), true, 'it should have a next page if page index is 0');
  vm.attr('activePageIndex', 9);
  assert.equal(vm.attr('hasNext'), false, 'it should not have a next page if page index is 9');
});

test('hasPrevious get()', assert => {
  vm.attr('pages', 10);
  vm.attr('activePageIndex', 0);
  assert.equal(vm.attr('hasPrevious'), false, 'it should not have a previous page if page index is 0');
  vm.attr('activePageIndex', 9);
  assert.equal(vm.attr('hasPrevious'), true, 'it should have a previous page if page index is 9');
});

test('visiblePages get()', assert => {
  vm.attr({
    'pages': 10,
    activeOffset: 3
  });
  let tests = [{
    index: 0,
    expected: [1, 2, 3, 4]
  }, {
    index: 5,
    expected: [3, 4, 5, 6, 7, 8, 9]
  }, {
    index: 9,
    expected: [7, 8, 9, 10]
  }];

  tests.forEach(test => {
    vm.attr('activePageIndex', test.index);
    assert.deepEqual(vm.attr('visiblePages'), test.expected, 'visiblePages should contain the correct offset pages');
  });
});

test('pageArray get()', assert => {
  let tests = [{
    pages: 5,
    expected: [1, 2, 3, 4, 5]
  }, {
    pages: 3,
    expected: [1, 2, 3]
  }];
  tests.forEach(test => {
    vm.attr('pages', test.pages);
    assert.deepEqual(vm.attr('pageArray'), test.expected, 'it should have the expected pages in the pageArray');
  });
});

test('gotoNext()', assert => {
  let tests = [{
    index: 0,
    expected: 1
  }, {
    index: 5,
    expected: 6
  }, {
    index: 9,
    expected: 9
  }];
  vm.attr('pages', 10);
  tests.forEach(test => {
    vm.attr('activePageIndex', test.index);
    vm.gotoNext();
    assert.equal(vm.attr('activePageIndex'), test.expected, 'it should increase the page index unless its at the last page');
  });
});

test('gotoPrevious()', assert => {
  let tests = [{
    index: 0,
    expected: 0
  }, {
    index: 5,
    expected: 4
  }, {
    index: 9,
    expected: 8
  }];
  vm.attr('pages', 10);
  tests.forEach(test => {
    vm.attr('activePageIndex', test.index);
    vm.gotoPrevious();
    assert.equal(vm.attr('activePageIndex'), test.expected, 'it should decrease the page index unless its at the first page');
  });
});

test('gotoFirst()', assert => {
  vm.attr('activePageIndex', 5);
  vm.gotoFirst();
  assert.equal(vm.attr('activePageIndex'), 0, 'The active page should be the first');
});

test('gotoLast()', assert => {
  vm.gotoLast();
  assert.equal(vm.attr('activePageIndex'), vm.attr('pages') - 1, 'the active page should be the last');
});

test('gotoPage(p)', assert => {
  vm.gotoPage(5);
  assert.equal(vm.attr('activePageIndex'), 4, 'the active page should be set correctly');
  vm.gotoPage(15);
  assert.equal(vm.attr('activePageIndex'), 4, 'the active page should not have changed if an invalid page is passed');
});

test('isActive(p)', assert => {
  assert.ok(vm.isActive(1), 'the first page should be active by default');
});
