// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Logger from '../logger/Logger';
import LogLevel from '../logger/LogLevel';
import Task from './Task';

/**
 * A task that wraps another task and ensures it is run only once,
 * regardless of how many times `run` is called.
 *
 * This allows you to implement a kind of barrier synchronization.
 */
export default class OnceTask implements Task {
  private promise: Promise<void> | undefined;

  constructor(
    private logger: Logger,
    private task: Task,
    private dependencies?: (Task | undefined)[]
  ) {}

  name(): string {
    return `${this.task.name()} (once)`;
  }

  cancel(): void {
    this.task.cancel();
    for (const dep of this.dependencies) {
      dep.cancel();
    }
  }

  logDependencies(): void {
    if (this.logger.getLogLevel() > LogLevel.INFO) {
      return;
    }
    const names = this.dependencies
      .filter(d => d)
      .map(d => d.name())
      .join(', ');
    this.logger.info(`${this.task.name()} waiting for dependencies: ${names}`);
  }

  run(): Promise<void> {
    if (this.promise) {
      return this.promise;
    }

    if (!this.dependencies?.length) {
      return (this.promise = this.task.run());
    }

    const dependencies = Promise.all(this.dependencies.map(d => d?.run()));
    return (this.promise = dependencies.then(() => {
      this.logDependencies();
      return this.task.run();
    }));
  }

  setParent(parentTask: Task): void {
    this.task.setParent(parentTask);
  }
}
