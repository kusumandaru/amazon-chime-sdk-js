// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { expect } from 'chai';
import * as sinon from 'sinon';

import { OnceTask } from '../../src';
import NoOpTask from '../../src/task/NoOpTask';

describe('OnceTask', () => {
  let inner: NoOpTask;
  let once: OnceTask;

  beforeEach(() => {
    inner = new NoOpTask();
    once = new OnceTask(inner);
  });

  describe('cancel', () => {
    it('cancels the inner task', () => {
      const cancel = sinon.spy(inner, 'cancel');
      once.cancel();
      expect(cancel.called).to.be.true;
    });
  });

  describe('name', () => {
    it('gets inner name', () => {
      expect(once.name()).to.equal('NoOpTask (once)');
    });
  });

  describe('run', async () => {
    it('can be sidestepped', async () => {
      const run = sinon.spy(inner, 'run');
      await inner.run();
      await once.run();
      expect(run.calledTwice).to.be.true;
      await once.run();
      expect(run.calledTwice).to.be.true;
    });

    it('runs exactly once', async () => {
      const run = sinon.spy(inner, 'run');
      await once.run();
      expect(run.calledOnce).to.be.true;
      await once.run();
      expect(run.calledOnce).to.be.true;
    });
  });

  describe('setParent', () => {
    it('sets parent on inner', () => {
      const setParent = sinon.spy(inner, 'setParent');
      const arg = new NoOpTask();
      once.setParent(arg);
      expect(setParent.calledWithExactly(arg)).to.be.true;
    });
  });
});
