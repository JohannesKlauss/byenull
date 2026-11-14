import { O } from 'byenull';
import type {MatcherState} from "./matcher";
import {toBeNone} from "./to-be-none";
import { describe, expect, it, vi } from 'vite-plus/test';

const createMatcherState = (state?: Partial<MatcherState>): MatcherState => ({
  isNot: false,
  utils: {
    matcherHint: vi.fn((matcherName: string) => matcherName),
    printReceived: vi.fn((value: unknown) => String(value).toString()),
  },
  ...state,
});

describe('toBeNone', () => {
  describe('when received is None', () => {
    const state = createMatcherState();
    const value = O.none();

    it('should return pass as true', () => {
      const { pass } = toBeNone.call(state, value);

      expect(pass).toBe(true);
    });
  });

  describe('when received is Some', () => {
    const state = createMatcherState();
    const value = O.some(42);

    it('should return pass as false', () => {
      const { pass } = toBeNone.call(state, value);

      expect(pass).toBe(false);
    });

    it('should return a message describing the received value', () => {
      const { message } = toBeNone.call(state, value);

      expect(message()).toContain('Expected value to be None');
    });
  });

  describe('when received is a string', () => {
    const state = createMatcherState();
    const value = 'not a result';

    it('should return pass as false', () => {
      const { pass } = toBeNone.call(state, value);

      expect(pass).toBe(false);
    });

    it('should return a message describing the received value', () => {
      const { message } = toBeNone.call(state, value);

      expect(message()).toContain('Expected value to be None');
    });
  });

  describe('when isNot is true', () => {
    const state = createMatcherState({ isNot: true });

    describe.each([
      { type: 'Some', value: O.some(42) },
      { type: 'None', value: O.none() },
      { type: 'string', value: 'not a result' },
    ])('when received is a $type', ({ value }) => {
      it('should return pass as true', () => {
        const { pass } = toBeNone.call(state, value);

        expect(pass).toBe(true);
      });

      it('should return a message suggesting to use toBeSome instead', () => {
        const { message } = toBeNone.call(state, value);

        expect(message()).toBe('Do not use .not with .toBeNone, use .toBeSome to match on Some values.');
      });
    });
  });
});