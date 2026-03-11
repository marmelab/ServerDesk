import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Simulate PointerEvent (for Select/Dropdown Radix)
if (!global.PointerEvent) {
  class PointerEvent extends Event {
    public pointerId: number;
    public button: number;

    constructor(type: string, props: PointerEventInit = {}) {
      super(type, props);
      this.pointerId = props.pointerId || 0;
      this.button = props.button || 0;
    }
  }
  // @ts-ignore - PointerEvent is readonly
  global.PointerEvent = PointerEvent;
}

// Simulate other functionalities
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.hasPointerCapture = vi.fn((_id: number) => false);
HTMLElement.prototype.releasePointerCapture = vi.fn((_id: number) => {});

// Simulate ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
